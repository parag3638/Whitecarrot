"use client"

import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { LogOut } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export default function SidebarLogoutButton() {
  const router = useRouter()

  const onLogout = () => {
    Cookies.remove("access_token")
    Cookies.remove("refresh_token")
    Cookies.remove("token_type")
    Cookies.remove("expires_at")
    Cookies.remove("user_email")
    router.push("/")
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          type="button"
          variant="outline"
          className="w-full justify-center gap-2 rounded-md border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
