import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Plan } from "@/models/Plan"

type PlanFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  planToEdit?: Plan | null
  onSave: (plan: Omit<Plan, "id">, id?: string) => void
}

// Formulario de alta/edición de un plan, dentro de un modal.
export default function PlanFormDialog({
  open,
  onOpenChange,
  planToEdit,
  onSave,
}: PlanFormDialogProps) {
  // Se inicializa una sola vez, leyendo planToEdit directo (sin useEffect).
  // El "reseteo" al cambiar de plan lo maneja la prop key desde PlanesPage.
  const [form, setForm] = useState({
    name: planToEdit?.name ?? "",
    price: planToEdit ? String(planToEdit.price) : "",
    durationDays: planToEdit ? String(planToEdit.durationDays) : "",
    description: planToEdit?.description ?? "",
  })

  // Actualiza un campo puntual del formulario sin pisar los demás.
  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Junta los valores del formulario y se los pasa al padre.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(
      {
        name: form.name,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        description: form.description,
      },
      planToEdit?.id
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{planToEdit ? "Editar Plan" : "Nuevo Plan"}</DialogTitle>
          <DialogDescription>
            {planToEdit
              ? "Modificá los datos del plan seleccionado."
              : "Completá los datos para crear un plan nuevo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Precio ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="durationDays">Duración (días)</Label>
              <Input
                id="durationDays"
                type="number"
                min="1"
                value={form.durationDays}
                onChange={(e) => updateField("durationDays", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{planToEdit ? "Guardar cambios" : "Crear plan"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}