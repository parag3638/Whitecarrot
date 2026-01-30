export type CompanySection = {
  id: string
  type: string
  title: string
  content: string | string[]
  order?: number
}

export type CompanyTheme = {
  primaryColor?: string
  accentColor?: string
  logoUrl?: string
  bannerUrl?: string
  font?: string
}

export type Company = {
  name: string
  slug: string
  status?: string
  theme?: CompanyTheme
  sections?: CompanySection[]
  culture_video_url?: string | null
}

export type Job = {
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
