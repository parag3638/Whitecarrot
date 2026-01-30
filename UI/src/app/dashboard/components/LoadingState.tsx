import { Loader2 } from "lucide-react"

export default function LoadingState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin" />
      <div className="text-sm">Loading company data...</div>
    </div>
  )
}
