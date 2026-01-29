"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Company = {
  name: string
  slug: string
  status?: string
  theme?: Record<string, unknown>
  sections?: unknown[]
  culture_video_url?: string
}

type ApiError = {
  status?: number
  message: string
}

type SectionType = "about" | "values" | "perks" | "culture" | "faq"

type Section = {
  id: string
  type: SectionType
  title: string
  content: string | string[]
  order: number
}

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
  const { toast } = useToast()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [theme, setTheme] = useState({
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
  const colorPresets = [
    "#0f172a",
    "#1e293b",
    "#111827",
    "#0ea5e9",
    "#38bdf8",
    "#22c55e",
    "#f97316",
    "#f59e0b",
  ]

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
        setError(getErrorDetails(err))
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
    return (
      <div className="text-sm text-muted-foreground">Loading company data...</div>
    )
  }

  if (error) {
    return (
      <Card className="flex min-h-[60vh] flex-col items-center justify-center border-red-200 bg-red-50 text-center">
        <CardContent className="pt-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-red-500">
            {error.status ? `Error ${error.status}` : "Error"}
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-red-700">
            {getErrorTitle(error.status)}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-red-700">{error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Recruiter Workspace
            </div>
            <h1 className="text-2xl font-semibold">{company?.name ?? "Company"}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {company?.slug ?? companySlug}
              </span>
              <span
                className={
                  company?.status === "draft"
                    ? "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700"
                    : "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700"
                }
              >
                {company?.status ?? "unknown"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} disabled={actionLoading}>
              {actionLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePublish("publish")}
              disabled={actionLoading}
            >
              Publish
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePublish("unpublish")}
              disabled={actionLoading}
            >
              Unpublish
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  id="primaryColor"
                  type="color"
                  className="h-10 w-12 cursor-pointer p-1"
                  value={theme.primaryColor}
                  onChange={(event) =>
                    setTheme((prev) => ({ ...prev, primaryColor: event.target.value }))
                  }
                />
                <Input
                  type="text"
                  className="h-10 w-36 font-mono"
                  value={theme.primaryColor}
                  onChange={(event) =>
                    setTheme((prev) => ({ ...prev, primaryColor: event.target.value }))
                  }
                  placeholder="#111827"
                />
                <div
                  className="h-10 w-16 rounded-md border border-input shadow-sm"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={`primary-${color}`}
                      type="button"
                      className="h-7 w-7 rounded-full border border-border shadow-sm transition hover:scale-105"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setTheme((prev) => ({ ...prev, primaryColor: color }))
                      }
                      aria-label={`Set primary color to ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  id="accentColor"
                  type="color"
                  className="h-10 w-12 cursor-pointer p-1"
                  value={theme.accentColor}
                  onChange={(event) =>
                    setTheme((prev) => ({ ...prev, accentColor: event.target.value }))
                  }
                />
                <Input
                  type="text"
                  className="h-10 w-36 font-mono"
                  value={theme.accentColor}
                  onChange={(event) =>
                    setTheme((prev) => ({ ...prev, accentColor: event.target.value }))
                  }
                  placeholder="#22c55e"
                />
                <div
                  className="h-10 w-16 rounded-md border border-input shadow-sm"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={`accent-${color}`}
                      type="button"
                      className="h-7 w-7 rounded-full border border-border shadow-sm transition hover:scale-105"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setTheme((prev) => ({ ...prev, accentColor: color }))
                      }
                      aria-label={`Set accent color to ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              type="text"
              value={theme.logoUrl}
              onChange={(event) =>
                setTheme((prev) => ({ ...prev, logoUrl: event.target.value }))
              }
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bannerUrl">Banner URL</Label>
            <Input
              id="bannerUrl"
              type="text"
              value={theme.bannerUrl}
              onChange={(event) =>
                setTheme((prev) => ({ ...prev, bannerUrl: event.target.value }))
              }
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="font">Font</Label>
            <Select
              value={theme.font}
              onValueChange={(value) =>
                setTheme((prev) => ({ ...prev, font: value }))
              }
            >
              <SelectTrigger id="font">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="nunito">Nunito</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cultureVideoUrl">Culture Video URL</Label>
            <Input
              id="cultureVideoUrl"
              type="text"
              value={cultureVideoUrl}
              onChange={(event) => setCultureVideoUrl(event.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle>Sections</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={newSectionType}
              onValueChange={(value) => setNewSectionType(value as SectionType)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="about">About</SelectItem>
                <SelectItem value="values">Values</SelectItem>
                <SelectItem value="perks">Perks</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="faq">FAQ</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleAddSection(newSectionType)}>
              Add section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sections.length === 0 && (
            <div className="rounded-md border border-dashed border-muted-foreground/40 p-4 text-sm text-muted-foreground">
              No sections yet. Use the dropdown above to add one.
            </div>
          )}
          {sections.map((section, index) => {
            const isPerks = section.type === "perks"
            const contentValue = isPerks
              ? Array.isArray(section.content)
                ? section.content.join("\n")
                : ""
              : String(section.content ?? "")

            return (
              <Card
                key={section.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="border-muted"
              >
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <div className="text-xs font-semibold uppercase text-muted-foreground">
                    {section.type}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSection(index)}
                  >
                    Delete
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-3 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor={`section-title-${section.id}`}>Title</Label>
                    <Input
                      id={`section-title-${section.id}`}
                      value={section.title}
                      onChange={(event) =>
                        handleSectionChange(index, { title: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`section-content-${section.id}`}>Content</Label>
                    <Textarea
                      id={`section-content-${section.id}`}
                      className="min-h-[120px]"
                      value={contentValue}
                      onChange={(event) =>
                        handleSectionChange(index, {
                          content: isPerks
                            ? event.target.value
                                .split("\n")
                                .map((line) => line.trim())
                                .filter(Boolean)
                            : event.target.value,
                        })
                      }
                      placeholder={
                        isPerks
                          ? "One perk per line"
                          : "Write section content..."
                      }
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Drag this card to reorder sections.
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>

    </div>
  )
}
