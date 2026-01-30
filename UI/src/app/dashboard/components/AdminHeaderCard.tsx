import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Company } from "../types"

type AdminHeaderCardProps = {
  company: Company | null
  companySlug: string
  actionLoading: boolean
  onSave: () => void
  onPublish: (action: "publish" | "unpublish") => void
}

export default function AdminHeaderCard({
  company,
  companySlug,
  actionLoading,
  onSave,
  onPublish,
}: AdminHeaderCardProps) {
  return (
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
          {companySlug ? (
            <Button asChild variant="secondary">
              <Link
                href={`/careers/${companySlug}`}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer"
              >
                View careers portal
              </Link>
            </Button>
          ) : null}
          <Button onClick={onSave} disabled={actionLoading}>
            {actionLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={() => onPublish("publish")}
            disabled={actionLoading}
          >
            Publish
          </Button>
          <Button
            variant="outline"
            onClick={() => onPublish("unpublish")}
            disabled={actionLoading}
          >
            Unpublish
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
