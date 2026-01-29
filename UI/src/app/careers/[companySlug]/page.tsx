import Image from "next/image"
import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Company = {
  name: string
  slug: string
  status?: string
  theme?: {
    primaryColor?: string
    accentColor?: string
    logoUrl?: string
    bannerUrl?: string
    font?: string
  }
  sections?: Array<{
    id: string
    type: string
    title: string
    content: string | string[]
    order?: number
  }>
  culture_video_url?: string | null
}

type Job = {
  id: string
  title: string
  location: string
  job_type: string
  department: string
  level: string
  work_mode: string
  salary_text: string
  slug: string
  posted_at: string
}

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000"
}

async function fetchCompany(companySlug: string): Promise<Company> {
  try {
    const res = await axios.get<{ company?: Company } | Company>(
      `${getApiBaseUrl()}/api/public/company/${companySlug}`
    )
    const company: Company | undefined = "company" in res.data ? res.data.company : (res.data as Company)
    if (!company || !company.name || !company.slug) {
      throw new Error("Invalid company data received from API")
    }
    return company
  } catch (error: any) {
    const status = error?.response?.status
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Request failed"
    const err = new Error(message) as Error & { status?: number }
    err.status = status
    throw err
  }
}

async function fetchJobs(companySlug: string): Promise<Job[]> {
  try {
    const res = await axios.get<{ jobs?: Job[] }>(
      `${getApiBaseUrl()}/api/public/company/${companySlug}/jobs`
    )
    return Array.isArray(res.data?.jobs) ? res.data.jobs : []
  } catch {
    return []
  }
}

function renderSectionContent(content: string | string[]) {
  if (Array.isArray(content)) {
    return (
      <ul className="list-disc pl-5 text-sm text-muted-foreground">
        {content.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    )
  }
  return <p className="text-sm text-muted-foreground">{content}</p>
}

export default async function CareersPage({
  params,
}: {
  params: { companySlug: string }
}) {
  let company: Company | null = null
  let loadError: { status?: number; message: string } | null = null
  let jobs: Job[] = []

  try {
    const [companyData, jobsData] = await Promise.all([
      fetchCompany(params.companySlug),
      fetchJobs(params.companySlug),
    ])
    company = companyData
    jobs = jobsData
  } catch (err: any) {
    loadError = { status: err?.status, message: err?.message ?? "Request failed" }
  }

  if (!company) {
    const status = loadError?.status ?? 404
    const title =
      status === 404 ? "Company not found" : "Unable to load company page"
    const description =
      loadError?.message ||
      "We couldn't find a published page for this company."

    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Error {status}
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-3 text-sm text-slate-500">{description}</p>
        </div>
      </div>
    )
  }
  const theme = company.theme ?? {}
  const sections = Array.isArray(company.sections)
    ? [...company.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : []

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header
        className="relative overflow-hidden border-b"
        style={{ borderColor: theme.primaryColor ?? "#0f172a" }}
      >
        {theme.bannerUrl ? (
          <div className="relative h-64 w-full">
            <Image
              src={theme.bannerUrl}
              alt={`${company.name} banner`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div
            className="h-32 w-full"
            style={{ backgroundColor: theme.primaryColor ?? "#0f172a" }}
          />
        )}
        <div className="mx-auto w-full max-w-5xl px-6 pb-10 pt-6">
          <div className="flex flex-wrap items-center gap-4">
            {theme.logoUrl ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white shadow">
                <Image
                  src={theme.logoUrl}
                  alt={`${company.name} logo`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl text-lg font-semibold text-white"
                style={{ backgroundColor: theme.primaryColor ?? "#0f172a" }}
              >
                {company.name?.[0]}
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Careers
              </p>
              <h1 className="text-3xl font-semibold">{company.name}</h1>
              <p className="text-sm text-muted-foreground">
                Build your future with {company.name}.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {sections.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No sections published yet.
              </div>
            )}

            {sections.map((section) => (
              <section
                key={section.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: theme.primaryColor ?? "#0f172a" }}
                  >
                    {section.title || section.type}
                  </h2>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: theme.accentColor ?? "#f97316",
                      color: "#fff",
                    }}
                  >
                    {section.type}
                  </span>
                </div>
                <div className="mt-3">{renderSectionContent(section.content)}</div>
              </section>
            ))}

            {company.culture_video_url && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: theme.primaryColor ?? "#0f172a" }}
                >
                  Culture Video
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {company.culture_video_url}
                </p>
              </section>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            {jobs.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No open roles at the moment.
              </div>
            )}
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.location} · {job.work_mode}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: theme.accentColor ?? "#f97316",
                      color: "#fff",
                    }}
                  >
                    {job.job_type}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-slate-700">Department:</span>{" "}
                    {job.department}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Level:</span>{" "}
                    {job.level}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Salary:</span>{" "}
                    {job.salary_text}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Posted:</span>{" "}
                    {new Date(job.posted_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: { companySlug: string }
}) {
  try {
    const company = await fetchCompany(params.companySlug)
    return {
      title: `${company.name} Careers`,
      description: `Explore roles at ${company.name}.`,
    }
  } catch {
    return {
      title: "Careers",
      description: "Explore open roles.",
    }
  }
}
