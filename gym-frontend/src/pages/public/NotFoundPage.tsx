import { Button } from "@/shared/components/ui/button"
import {
  House,
  ArrowLeft,
} from "lucide-react"

export default function NotFoundPage() {
  return (
    <section className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-background px-6 py-12 text-center text-foreground">
      <p className="font-mono text-7xl font-bold tracking-tighter sm:text-8xl">
        404
      </p>

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Page not found
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          La página que estás buscando no existe o ha sido movida. Verifica la URL o regresa a la página principal.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Button asChild className="w-full sm:w-auto">
          <a href="/">
            <House data-icon="inline-start" aria-hidden="true" />
            Volver a la página principal
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <a href="#" onClick={() => window.history.back()}>
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Volver a la página anterior
          </a>
        </Button>
      </div>
    </section>
  )
}