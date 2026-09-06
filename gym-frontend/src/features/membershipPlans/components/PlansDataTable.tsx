"use client"
import {
  RiDeleteBinLine,
  RiMoreLine,
  RiPencilLine,
} from "@remixicon/react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import type { MembershipPlan } from "@/features/membershipPlans/models/MembershipPlan"

type PlansDataTableProps = {
  plans: MembershipPlan[]
  onEdit: (plan: MembershipPlan) => void
  onDelete: (id: number) => Promise<void>
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
  // Elimina un plan; el hook ya avisa el resultado con un toast.
  async function handleDelete(plan: MembershipPlan) {
    try {
      await onDelete(plan.id)
    } catch {
      // error already surfaced via toast
    }
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
              <TableHead className="h-10 pl-4 text-left text-sm font-medium tracking-wide text-muted-foreground uppercase">Plan</TableHead>
              <TableHead className="h-10 text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">Precio</TableHead>
              <TableHead className="h-10 text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">Duración</TableHead>
              <TableHead className="h-10 text-left text-sm font-medium tracking-wide text-muted-foreground uppercase">Descripción</TableHead>
              <TableHead className="h-10 text-center">
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
                  <TableCell className="py-3 pl-4 text-left text-base font-medium">{plan.name}</TableCell>
                  <TableCell className="py-3 text-center">
                    <Badge variant="secondary" className="text-sm">{formatPrice(plan.price)}</Badge>
                  </TableCell>
                  <TableCell className="py-3 text-center text-base text-muted-foreground">
                    {plan.durationDays} días
                  </TableCell>
                  <TableCell className="max-w-xs truncate py-3 text-left text-base text-muted-foreground">
                    {plan.description}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Acciones para ${plan.name}`} className="size-8">
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
                <TableCell colSpan={5} className="h-24 text-center text-base text-muted-foreground">
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