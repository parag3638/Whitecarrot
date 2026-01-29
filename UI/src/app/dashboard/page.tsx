import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Dashboard from "./Dashboard"

export default function Page() {
  const cookieStore = cookies()
  const token = cookieStore.get("access_token")?.value;

  // Redirect unauthenticated users back home.
  if (!token) {
    redirect("/")
  }

  return <Dashboard />
}
