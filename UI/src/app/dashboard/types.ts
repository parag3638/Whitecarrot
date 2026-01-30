export type Company = {
  name: string
  slug: string
  status?: string
  theme?: Record<string, unknown>
  sections?: unknown[]
  culture_video_url?: string
}

export type ApiError = {
  status?: number
  message: string
}

export type SectionType = "about" | "values" | "perks" | "culture" | "faq"

export type Section = {
  id: string
  type: SectionType
  title: string
  content: string | string[]
  order: number
}

export type ThemeState = {
  primaryColor: string
  accentColor: string
  logoUrl: string
  bannerUrl: string
  font: string
}
