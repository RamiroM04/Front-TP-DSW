import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

export default function TemporalLanding() {
  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>
          Track progress and recent activity for your Vite app.
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        Todavía no implementamos auth y roles, las pages de cada rol están en <a href="/administrativo" className="text-blue-500 underline">/administrativo</a>, <a href="/instructor" className="text-blue-500 underline">/instructor</a> y <a href="/socio" className="text-blue-500 underline">/socio</a> usan un layout por roles `RoleLayout` y sidebar `RoleSidebar` para mostrar los links según el rol del usuario.
        Este layout provee la barra lateral `RoleSidebar` y el área principal donde se montan las páginas.
      </CardContent>

      <CardContent>
        Integramos componentes de UI desde la librería <a href="https://ui.shadcn.com/" className="text-blue-500 underline" target="_blank">shadcn</a>: botones, diálogos, cards, tables etc.
      </CardContent>

      <CardContent>
        Cruds funcionales conectados a la API; <a href="/administrativo/planes" className="text-blue-500 underline">/administrativo/planes</a>, <a href="/administrativo/socios" className="text-blue-500 underline">/administrativo/socios</a>
      </CardContent>
    </Card>
  )
}