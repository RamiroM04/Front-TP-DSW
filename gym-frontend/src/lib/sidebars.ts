import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  ClipboardList,
  Dumbbell,
  House,
  NotebookPen,
  Users,
} from "lucide-react"

export type AppRole = "admin" | "instructor" | "member"

export type SidebarLink = {
  to: string
  label: string
  icon?: LucideIcon
}

export const ROLE_NAVIGATION: Record<
  AppRole,
  { title: string; links: SidebarLink[] }
> = {
  admin: {
    title: "Administrativo",
    links: [
      { to: "/administrativo/", label: "Inicio", icon: House },
      { to: "/administrativo/clases", label: "Clases", icon: Calendar },
      { to: "/administrativo/socios", label: "Socios", icon: Users },
    ],
  },
  instructor: {
    title: "Instructor",
    links: [
      { to: "/instructor/", label: "Inicio", icon: House },
      { to: "/instructor/rutinas", label: "Rutinas", icon: ClipboardList },
      {
        to: "/instructor/ejercicios",
        label: "Ejercicios",
        icon: NotebookPen,
      },
    ],
  },
  member: {
    title: "Socio",
    links: [
      { to: "/socio/", label: "Inicio", icon: House },
      { to: "/socio/rutinas", label: "Rutinas", icon: Dumbbell },
      { to: "/socio/clases", label: "Clases", icon: Calendar },
    ],
  },
}

export const ADMIN_LINKS = ROLE_NAVIGATION.admin.links
export const INSTRUCTOR_LINKS = ROLE_NAVIGATION.instructor.links
export const MEMBER_LINKS = ROLE_NAVIGATION.member.links