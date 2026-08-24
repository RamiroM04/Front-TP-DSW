import React from "react"
import { NavLink } from "react-router-dom"
import { Dumbbell } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarSeparator,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/shared/components/ui/sidebar"
import type { SidebarLink } from "@/config/navigation"

type RoleSidebarProps = {
  links: SidebarLink[],
  title?: React.ReactNode,
  footer?: React.ReactNode,
}

export default function RoleSidebar({
  links,
  title = "MyGymManager",
  footer,
}: RoleSidebarProps) {
  const homeLink = links[0]

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="px-2 py-2">
        {homeLink ? (
          <NavLink
            to={homeLink.to}
            end={homeLink.to.endsWith("/")}
            aria-label={`${title} home`}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1 transition-[width,padding,gap,margin] duration-200 ease-in-out group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0"
          >
            <Dumbbell className="size-6 shrink-0 group-data-[collapsible=icon]:mx-auto" aria-hidden="true" />
            <span className="max-w-32 overflow-hidden whitespace-nowrap font-semibold opacity-100 transition-[max-width,opacity] duration-200 ease-in-out group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
              {title}
            </span>
          </NavLink>
        ) : null}
      </SidebarHeader>

      <SidebarSeparator className="mx-auto my-1 w-[calc(100%-1rem)] transition-[width] duration-200 ease-in-out group-data-[collapsible=icon]:w-6" />

      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.to}>
              <SidebarMenuButton asChild tooltip={link.label}>
                <NavLink to={link.to} end={link.to.endsWith("/")}>
                  {link.icon ? <link.icon aria-hidden="true" /> : null}
                  <span className="max-w-40 overflow-hidden whitespace-nowrap opacity-100 transition-[max-width,opacity] duration-200 ease-in-out group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
                    {link.label}
                  </span>
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