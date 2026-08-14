"use client"
import {
  RiDeleteBinLine,
  RiMoreLine,
  RiPencilLine,
} from "@remixicon/react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Plan } from "@/models/Plan"

type PlansDataTableProps = {
  plans: Plan[]
  onEdit: (plan: Plan) => void
  onDelete: (id: string) => void
  title?: string
  subtitle?: string
}

// Formatea un número como precio.
function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(
    value
  )
}

export default function PlansDataTable({ plans, onEdit, onDelete, title, subtitle }: PlansDataTableProps) {
  // Elimina un plan y avisa con un toast.
  function handleDelete(plan: Plan) {
    onDelete(plan.id)
    toast("Plan eliminado", { description: `${plan.name} fue eliminado.` })
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title ?? ""}</h1>
          <p className="text-sm text-muted-foreground">
            {subtitle ?? ""}
          </p>
        </div>
      </div>
      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
              <TableHead className="h-9 pl-4 text-left">Plan</TableHead>
              <TableHead className="h-9 text-center">Precio</TableHead>
              <TableHead className="h-9 text-center">Duración</TableHead>
              <TableHead className="h-9 text-left">Descripción</TableHead>
              <TableHead className="h-9 text-center">
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length ? (
              plans.map((plan) => (
                <TableRow
                  key={plan.id}
                  className="border-b border-border transition-colors duration-100 last:border-b-0 hover:bg-muted/30"
                >
                  <TableCell className="py-3 pl-4 text-left font-medium">{plan.name}</TableCell>
                  <TableCell className="py-3 text-center">
                    <Badge variant="secondary">{formatPrice(plan.price)}</Badge>
                  </TableCell>
                  <TableCell className="py-3 text-center text-muted-foreground">
                    {plan.durationDays} días
                  </TableCell>
                  <TableCell className="max-w-xs truncate py-3 text-left text-muted-foreground">
                    {plan.description}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Acciones para ${plan.name}`}>
                          <RiMoreLine className="size-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(plan)}>
                          <RiPencilLine aria-hidden="true" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(plan)}>
                          <RiDeleteBinLine aria-hidden="true" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="h-24 text-center text-sm text-muted-foreground">
                  No hay planes cargados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}