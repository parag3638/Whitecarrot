"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Cookies from "js-cookie"
import { useToast } from "@/hooks/use-toast"
import AdminHeaderCard from "./components/AdminHeaderCard"
import BrandingCard from "./components/BrandingCard"
import ErrorState from "./components/ErrorState"
import LoadingState from "./components/LoadingState"
import SectionsCard from "./components/SectionsCard"
import type { ApiError, Company, Section, SectionType, ThemeState } from "./types"

function getTokenFromCookie() {
  return Cookies.get("access_token") ?? null
}

function getAxiosConfig() {
  const token = getTokenFromCookie()
  return {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://authbackend-cc2d.onrender.com",
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  }
}

function normalizeCompany(
  data: Company | { company?: Company } | null | undefined
): Company | null {
  if (!data) return null
  if (typeof data === "object" && "company" in data) {
    return (data as { company?: Company }).company ?? null
  }
  return data as Company
}

function normalizeSections(sections: unknown[], fallback: Section[]) {
  if (!Array.isArray(sections)) return fallback
  return sections.map((section: any, index: number) => ({
    id: String(section?.id ?? `${section?.type ?? "section"}-${index}`),
    type: (section?.type ?? "about") as SectionType,
    title: String(section?.title ?? ""),
    content: section?.content ?? "",
    order: typeof section?.order === "number" ? section.order : index + 1,
  }))
}

function formatValidationErrors(data: any) {
  const formErrors = Array.isArray(data?.formErrors) ? data.formErrors : []
  const fieldErrors = data?.fieldErrors && typeof data.fieldErrors === "object"
    ? data.fieldErrors
    : null

  const lines: string[] = []
  for (const err of formErrors) {
    if (typeof err === "string") lines.push(err)
  }
  if (fieldErrors) {
    for (const [field, errors] of Object.entries(fieldErrors)) {
      if (Array.isArray(errors) && errors.length) {
        lines.push(`${field}: ${errors.join(", ")}`)
      }
    }
  }
  return lines.length ? lines.join(" | ") : null
}

function getErrorDetails(error: any): ApiError {
  const status = error?.response?.status
  const data = error?.response?.data
  const validationMessage = formatValidationErrors(data)
  const rawMessage =
    validationMessage ||
    data?.message ||
    data?.error ||
    error?.message ||
    "Request failed."
  const message =
    typeof rawMessage === "string" ? rawMessage : JSON.stringify(rawMessage)
  return { status, message }
}

function getErrorTitle(status?: number) {
  if (!status) return "Request failed"
  if (status === 401 || status === 403) return "Access denied"
  if (status === 404) return "Company not found"
  if (status >= 500) return "Server error"
  return "Request failed"
}

function getCompanySlugMap(): Record<string, string> {
  const raw = process.env.NEXT_PUBLIC_COMPANY_SLUG_MAP
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

export default function AdminPanel() {
  const router = useRouter()
  const { toast } = useToast()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [theme, setTheme] = useState<ThemeState>({
    primaryColor: "#0f172a",
    accentColor: "#f97316",
    logoUrl: "",
    bannerUrl: "",
    font: "inter",
  })
  const [sections, setSections] = useState<Section[]>([])
  const [cultureVideoUrl, setCultureVideoUrl] = useState("")
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [newSectionType, setNewSectionType] = useState<SectionType>("about")

  const companySlug = useMemo(() => {
    const map = getCompanySlugMap()
    const userEmail = typeof window !== "undefined" ? Cookies.get("user_email") : null
    const domain = userEmail?.split("@")[1]?.toLowerCase()
    return (domain && map[domain]) || process.env.NEXT_PUBLIC_COMPANY_SLUG || ""
  }, [])

  const endpointBase = useMemo(
    () => `/api/recruiter/company/${companySlug}`,
    [companySlug]
  )

  useEffect(() => {
    const token = getTokenFromCookie()
    if (!token) {
      setError({ status: 401, message: "Access token is missing. Please login." })
      setLoading(false)
      router.replace("/login")
      return
    }

    const fetchCompany = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get<{ company?: Company } | Company>(
          endpointBase,
          getAxiosConfig()
        )
        const data = normalizeCompany(res.data)
        setCompany(data)
        const nextTheme = data?.theme ?? {}
        setTheme((prev) => ({
          primaryColor: String(nextTheme.primaryColor ?? prev.primaryColor),
          accentColor: String(nextTheme.accentColor ?? prev.accentColor),
          logoUrl: String(nextTheme.logoUrl ?? prev.logoUrl),
          bannerUrl: String(nextTheme.bannerUrl ?? prev.bannerUrl),
          font: String(nextTheme.font ?? prev.font),
        }))
        setSections(
          normalizeSections(Array.isArray(data?.sections) ? data?.sections : [], [])
        )
        setCultureVideoUrl(
          "culture_video_url" in (data ?? {}) ? String((data as Company).culture_video_url ?? "") : ""
        )
      } catch (err) {
        const details = getErrorDetails(err)
        setError(details)
        if (details.status === 401 || details.status === 403) {
          router.replace("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    if (!companySlug) {
      setError({ status: 400, message: "Company slug could not be resolved." })
      setLoading(false)
      return
    }

    void fetchCompany()
  }, [endpointBase, companySlug])

  const handleSave = async () => {
    setActionLoading(true)
    setError(null)
    try {
      const payloadSections = sections.map((section, index) => ({
        ...section,
        order: index + 1,
      }))
      const res = await axios.put<{ company?: Company } | Company>(
        endpointBase,
        {
          theme,
          sections: payloadSections,
          culture_video_url: cultureVideoUrl,
        },
        getAxiosConfig()
      )
      const data = normalizeCompany(res.data)
      setCompany(data)
      const nextTheme = data?.theme ?? theme
      setTheme((prev) => ({
        primaryColor: String(nextTheme.primaryColor ?? prev.primaryColor),
        accentColor: String(nextTheme.accentColor ?? prev.accentColor),
        logoUrl: String(nextTheme.logoUrl ?? prev.logoUrl),
        bannerUrl: String(nextTheme.bannerUrl ?? prev.bannerUrl),
        font: String(nextTheme.font ?? prev.font),
      }))
      setSections(
        normalizeSections(
          Array.isArray(data?.sections) ? data?.sections : payloadSections,
          payloadSections
        )
      )
      setCultureVideoUrl(
        "culture_video_url" in (data ?? {}) ? String((data as Company).culture_video_url ?? cultureVideoUrl) : cultureVideoUrl
      )
      toast({
        title: "Saved",
        description: "Theme, sections, and culture video updated.",
      })
    } catch (err) {
      const details = getErrorDetails(err)
      setError(details)
      if (details.status === 401 || details.status === 403) {
        router.replace("/login")
        return
      }
      toast({
        title: details.status ? `Save failed (${details.status})` : "Save failed",
        description: details.message,
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handlePublish = async (action: "publish" | "unpublish") => {
    setActionLoading(true)
    setError(null)
    try {
      await axios.post(`${endpointBase}/${action}`, undefined, getAxiosConfig())
      const res = await axios.get<{ company?: Company } | Company>(
        endpointBase,
        getAxiosConfig()
      )
      const data = normalizeCompany(res.data)
      setCompany(data)
      toast({
        title: action === "publish" ? "Published" : "Unpublished",
        description:
          action === "publish"
            ? "The company page is now live."
            : "The company page is now offline.",
      })
    } catch (err) {
      const details = getErrorDetails(err)
      setError(details)
      if (details.status === 401 || details.status === 403) {
        router.replace("/login")
        return
      }
      toast({
        title: details.status
          ? `Request failed (${details.status})`
          : "Request failed",
        description: details.message,
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleSectionChange = (
    index: number,
    update: Partial<Section>
  ) => {
    setSections((prev) =>
      prev.map((section, i) => (i === index ? { ...section, ...update } : section))
    )
  }

  const handleAddSection = (type: SectionType) => {
    setSections((prev) => [
      ...prev,
      {
        id: `${type}-${Date.now()}`,
        type,
        title: "",
        content: type === "perks" ? [] : "",
        order: prev.length + 1,
      },
    ])
  }

  const handleDeleteSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return
    setSections((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(index, 0, moved)
      return next.map((section, i) => ({ ...section, order: i + 1 }))
    })
    setDragIndex(null)
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <ErrorState
        status={error.status}
        title={getErrorTitle(error.status)}
        message={error.message}
      />
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeaderCard
        company={company}
        companySlug={companySlug}
        actionLoading={actionLoading}
        onSave={handleSave}
        onPublish={handlePublish}
      />
      <BrandingCard
        theme={theme}
        setTheme={setTheme}
        cultureVideoUrl={cultureVideoUrl}
        setCultureVideoUrl={setCultureVideoUrl}
      />
      <SectionsCard
        sections={sections}
        newSectionType={newSectionType}
        setNewSectionType={setNewSectionType}
        onAddSection={handleAddSection}
        onDeleteSection={handleDeleteSection}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onSectionChange={handleSectionChange}
      />
    </div>
  )
}
