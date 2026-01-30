import Image from "next/image"
import type { Company, CompanyTheme } from "../types"

type CompanyHeaderProps = {
  company: Company
  theme: CompanyTheme
}

export default function CompanyHeader({ company, theme }: CompanyHeaderProps) {
  return (
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
  )
}
