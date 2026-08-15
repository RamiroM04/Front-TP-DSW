"use client"

import { RiDeleteBinLine, RiMoreLine, RiPencilLine } from "@remixicon/react"
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
import { getInstructorName } from "@/lib/instructorLookup"
import type { ClassSchedule } from "@/models/ClassSchedule"
import type { Instructor } from "@/models/Instructor"

type ClassesDataTableProps = {
  classes: ClassSchedule[]
  instructors: Instructor[]
  onEdit: (item: ClassSchedule) => void
  onDelete: (id: string) => void
}

export default function ClassesDataTable({ classes, instructors, onEdit, onDelete }: ClassesDataTableProps) {
  // Elimina una clase y avisa con un toast.
  function handleDelete(item: ClassSchedule) {
    onDelete(item.id)
    toast("Clase eliminada", { description: `${item.name} fue eliminada.` })
  }

  return (
    <div className="border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-9 pl-4 text-left">Clase</TableHead>
            <TableHead className="h-9 text-center">Categoría</TableHead>
            <TableHead className="h-9 text-center">Instructor</TableHead>
            <TableHead className="h-9 text-center">Día</TableHead>
            <TableHead className="h-9 text-center">Horario</TableHead>
            <TableHead className="h-9 text-center">Duración</TableHead>
            <TableHead className="h-9 text-center">Cupos</TableHead>
            <TableHead className="h-9 text-center">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.length ? (
            classes.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-border transition-colors duration-100 last:border-b-0 hover:bg-muted/30"
              >
                <TableCell className="py-3 pl-4 text-left font-medium">{item.name}</TableCell>
                <TableCell className="py-3 text-center">
                  <Badge variant="outline">{item.category}</Badge>
                </TableCell>
                <TableCell className="py-3 text-center text-muted-foreground">
                  {getInstructorName(instructors, item.instructorId)}
                </TableCell>
                <TableCell className="py-3 text-center text-muted-foreground">{item.dayOfWeek}</TableCell>
                <TableCell className="py-3 text-center text-muted-foreground">{item.startTime}</TableCell>
                <TableCell className="py-3 text-center text-muted-foreground">
                  {item.durationMinutes} min
                </TableCell>
                <TableCell className="py-3 text-center text-muted-foreground">{item.maxCapacity}</TableCell>
                <TableCell className="py-3 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`Acciones para ${item.name}`}>
                        <RiMoreLine className="size-4" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <RiPencilLine aria-hidden="true" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => handleDelete(item)}>
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
              <TableCell colSpan={8} className="h-24 text-center text-sm text-muted-foreground">
                No hay clases cargadas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}