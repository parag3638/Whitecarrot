type ErrorStateProps = {
  status: number
  title: string
  description: string
}

export default function ErrorState({ status, title, description }: ErrorStateProps) {
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
