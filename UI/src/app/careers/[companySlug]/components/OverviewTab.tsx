import type { Company, CompanySection, CompanyTheme } from "../types"
import SectionContent from "./SectionContent"

type OverviewTabProps = {
  company: Company
  theme: CompanyTheme
  sections: CompanySection[]
}

export default function OverviewTab({ company, theme, sections }: OverviewTabProps) {
  return (
    <>
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
          <div className="mt-3">
            <SectionContent content={section.content} />
          </div>
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
    </>
  )
}
