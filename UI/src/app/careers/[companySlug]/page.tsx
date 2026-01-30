import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompanyHeader from "./components/CompanyHeader"
import ErrorState from "./components/ErrorState"
import JobsTab from "./components/JobsTab"
import OverviewTab from "./components/OverviewTab"
import type { Company, Job } from "./types"

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://authbackend-cc2d.onrender.com"
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

    return <ErrorState status={status} title={title} description={description} />
  }
  const theme = company.theme ?? {}
  const sections = Array.isArray(company.sections)
    ? [...company.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : []

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <CompanyHeader company={company} theme={theme} />

      <main className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab company={company} theme={theme} sections={sections} />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <JobsTab jobs={jobs} theme={theme} />
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
