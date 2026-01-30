import type { CompanyTheme, Job } from "../types"

type JobsTabProps = {
  jobs: Job[]
  theme: CompanyTheme
}

export default function JobsTab({ jobs, theme }: JobsTabProps) {
  return (
    <>
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
    </>
  )
}
