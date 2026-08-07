import React from "react"
import { NavLink } from "react-router-dom"
import { Dumbbell } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import type { SidebarLink } from "@/lib/sidebars"

type RoleSidebarProps = {
  links: SidebarLink[],
  title?: React.ReactNode,
  footer?: React.ReactNode,
}

export default function RoleSidebar({
  links,
  title = "MyGym",
  footer,
}: RoleSidebarProps) {

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="px-2 py-2">
        <div className="flex items-center gap-2 rounded-md px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Dumbbell className="size-5 shrink-0" aria-hidden="true" />
          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            {title}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.to}>
              <SidebarMenuButton asChild tooltip={link.label}>
                <NavLink to={link.to} end={link.to.endsWith("/")}>
                  {link.icon ? <link.icon aria-hidden="true" /> : null}
                  <span>{link.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
    </Sidebar>
  )
}