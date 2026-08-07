import { Outlet } from "react-router-dom"
import RoleBottomNav from "@/components/RoleBottomNav"
import RoleSidebar from "@/components/RoleSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ROLE_NAVIGATION, type AppRole } from "@/lib/sidebars"
//import { Avatar } from "@/components/ui/avatar"
import { Bell, Settings, CircleUser } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle.tsx"

export default function RoleLayout({
  role,
}: {
  role: AppRole
}) {
  const { links, title } = ROLE_NAVIGATION[role]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RoleSidebar links={links} title={title} />

        <SidebarInset className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="hidden md:inline-flex" />
            <span className="text-lg font-medium">Portal {title}</span>
            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <Bell className="h-4 w-4" /> {/* TODO: Implementar con componente: A notification icon component in React typically combines a SVG bell icon with an absolute-positioned badge element to display the unread alert count*/}
              <Settings className="h-4 w-4" />
              <CircleUser className="h-4 w-4" /> {/* TODO: Implementar con componente Avatar */}
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 pb-24 md:p-6 md:pb-6">
            <Outlet />
          </main>

          <footer className="border-t px-4 py-3 pb-20 text-center text-sm text-muted-foreground md:pb-3">
            © 2026 Gym Management
          </footer>

          <RoleBottomNav links={links} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}