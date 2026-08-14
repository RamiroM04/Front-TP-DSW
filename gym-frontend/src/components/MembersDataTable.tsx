"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  RiArrowDownLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiExpandUpDownLine,
  RiLayoutColumnLine,
  RiMoreLine,
  RiPencilLine,
  RiSearchLine,
  RiUserLine,
  RiUserSettingsLine,
} from "@remixicon/react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useIsMobile } from "@/hooks/use-mobile"

import type { Member, Role, Status } from "../models/Member"

// TODO: Ajustar que cuando se vuelve de un breackpoint mobile a desktop se vuelvan a mostrar todas las columnas nuevamente.

type SociosDataTableProps = {
  initialData: Member[]
  title?: string
  subtitle?: string
}

const statusVariant: Record<Status, "default" | "secondary" | "outline"> = {
  Activo: "default",
  Inactivo: "secondary"
}

const roleClass: Record<Role, string> = {
  Basico: "text-foreground",
  Plus: "text-foreground",
  Premium: "text-foreground",
}

const COLUMN_LABELS: Record<string, string> = {
  name: "Socio",
  status: "Estado",
  role: "Plan",
  nextExpiration: "Próximo Vencimiento",
  joined: "Fecha de Inscripción",
}

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

function formatDate(value: string) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : dateFmt.format(parsed)
}

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") {
    return <RiArrowUpLine className="size-3.5" aria-hidden="true" />
  }
  if (sorted === "desc") {
    return <RiArrowDownLine className="size-3.5" aria-hidden="true" />
  }
  return (
    <RiExpandUpDownLine
      className="size-3.5 text-muted-foreground/60"
      aria-hidden="true"
    />
  )
}

const columns: ColumnDef<Member>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(checked === true)
        }
        aria-label="Select all members on this page"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        aria-label={`Select ${row.original.name}`}
      />
    ),
  },
  {
    accessorKey: "name",
    enableHiding: false,
    header: ({ column }) => (
      <button
        type="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-mx-1 inline-flex items-center gap-1 rounded-none px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        Socio
        <SortIcon sorted={column.getIsSorted()} />
      </button>
    ),
    filterFn: (row, _id, value: string) => {
      const q = value.toLowerCase()
      return (
        row.original.name.toLowerCase().includes(q) ||
        row.original.email.toLowerCase().includes(q)
      )
    },
    cell: ({ row }) => {
      const member = row.original
      return (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="sm" className="shrink-0 border border-border">
            <AvatarImage
              src={member.avatar}
              alt={member.name}
              className="grayscale"
            />
            <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm leading-tight font-medium">{member.name}</p>
            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <button
        type="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-mx-1 inline-flex items-center gap-1 rounded-none px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        Plan
        <SortIcon sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className={cn("text-sm", roleClass[row.original.plan])}>{row.original.plan}</span>
    ),
  },
  {
    accessorKey: "status",
    enableSorting: false,
    header: () => (
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Estado
      </span>
    ),
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]} className="text-xs">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "nextExpiration",
    sortingFn: "datetime",
    header: ({ column }) => (
      <button
        type="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-mx-1 inline-flex items-center justify-center gap-1 rounded-none px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        Próximo Vencimiento
        <SortIcon sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="block text-center text-xs text-muted-foreground tabular-nums">
        {formatDate(row.original.nextExpiration ?? row.original.joined)}
      </span>
    ),
  },
  {
    accessorKey: "joined",
    sortingFn: "datetime",
    header: ({ column }) => (
      <button
        type="button"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-mx-1 inline-flex items-center justify-center gap-1 rounded-none px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        Fecha de Inscripción
        <SortIcon sorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="block text-center text-xs text-muted-foreground tabular-nums">
        {formatDate(row.original.joined)}
      </span>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${row.original.name}`}
            >
              <RiMoreLine className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>
              <RiUserLine aria-hidden="true" />
              Ver perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RiPencilLine aria-hidden="true" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <RiDeleteBinLine aria-hidden="true" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

export default function SociosDataTable({
  initialData,
  title,
  subtitle,
}: SociosDataTableProps) {
  const isMobile = useIsMobile()
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "joined", desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState(initialData)

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  })

  React.useEffect(() => {
    setColumnVisibility((prev) => {
      if (Object.keys(prev).length > 0) {
        return prev
      }

      return isMobile ? { nextExpiration: false, joined: false } : {}
    })
  }, [isMobile])

  const nameFilter = (table.getColumn("name")?.getFilterValue() as string) ?? ""
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const totalCount = table.getFilteredRowModel().rows.length
  const pageCount = table.getPageCount()

  function handleRemove() {
    const selectedIds = new Set(
      table.getFilteredSelectedRowModel().rows.map((row) => row.id)
    )
    setData((prev) => prev.filter((row) => !selectedIds.has(row.id)))
    table.resetRowSelection()
    toast("Members removed", {
      description: `${selectedIds.size} ${selectedIds.size === 1 ? "member" : "members"} removed from the workspace.`,
    })
  }

  return (
    <section className="w-full">
      <div className="w-full">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-semibold">{title ?? ""}</h1>
              <p className="text-sm text-muted-foreground">
                {subtitle ?? ""}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-nowrap items-center gap-2 sm:w-auto sm:flex-wrap">
            <div className="relative min-w-0 flex-1 sm:w-auto sm:flex-none">
              <RiSearchLine
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={nameFilter}
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                placeholder="Buscar socios..."
                className="h-8 w-full sm:w-56 pl-8 text-sm"
                aria-label="Buscar socios por nombre o correo electrónico"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  aria-label="Toggle columns"
                >
                  <RiLayoutColumnLine className="size-3.5" aria-hidden="true" />
                  Columnas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Filtrar Columnas</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(checked) =>
                          column.toggleVisibility(checked === true)
                        }
                      >
                        {COLUMN_LABELS[column.id] ?? column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground tabular-nums">
                {selectedCount} {selectedCount === 1 ? "socio seleccionado" : "socios seleccionados"}
              </span>
              <Button
                variant="ghost"
                size="xs"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => table.resetRowSelection()}
              >
                Limpiar
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast("Export started", {
                    description: `Exporting ${selectedCount} members to CSV.`,
                  })
                }
              >
                <RiDownloadLine className="size-3.5" aria-hidden="true" />
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast("Role updated", {
                    description: `Changed the role for ${selectedCount} members.`,
                  })
                }
              >
                <RiUserSettingsLine className="size-3.5" aria-hidden="true" />
                Cambiar Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleRemove}
              >
                <RiDeleteBinLine className="size-3.5" aria-hidden="true" />
                Eliminar
              </Button>
            </div>
          </div>
        )}

        <div className="border border-border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border bg-muted/40 hover:bg-muted/40"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-9 text-center align-middle",
                        header.column.id === "select" && "pl-4 text-left",
                        header.column.id === "name" && "pl-2 text-left",
                        (header.column.id === "nextExpiration" ||
                          header.column.id === "joined") && "px-3"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className="border-b border-border transition-colors duration-100 last:border-b-0 hover:bg-muted/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "py-3 text-center align-middle",
                          cell.column.id === "select" && "pl-4 text-left",
                          cell.column.id === "name" && "pl-2",
                          (cell.column.id === "joined" ||
                            cell.column.id === "nextExpiration") && "px-3"
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No se encontraron socios.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between gap-4 border-t border-border bg-muted/20 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{totalCount}</span>{" "}
              {totalCount === 1 ? "Resultado" : "Resultados"}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Página anterior"
              >
                <RiArrowLeftSLine className="size-3.5" aria-hidden="true" />
              </Button>
              <span className="px-1 text-xs text-muted-foreground tabular-nums">
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {Math.max(pageCount, 1)}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Página siguiente"
              >
                <RiArrowRightSLine className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </section>
  )
}
