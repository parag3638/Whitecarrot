import { Card, CardContent } from "@/components/ui/card"

type ErrorStateProps = {
  status?: number
  title: string
  message: string
}

export default function ErrorState({ status, title, message }: ErrorStateProps) {
  return (
    <Card className="flex min-h-[60vh] flex-col items-center justify-center border-red-200 bg-red-50 text-center">
      <CardContent className="pt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-red-500">
          {status ? `Error ${status}` : "Error"}
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-red-700">{title}</h2>
        <p className="mt-3 max-w-xl text-sm text-red-700">{message}</p>
      </CardContent>
    </Card>
  )
}
