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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockInstructors } from "@/services/mockInstructors"
import type { ClassCategory, ClassSchedule, DayOfWeek } from "@/models/ClassSchedule"

const categories: ClassCategory[] = ["HIIT", "Strength", "Zen", "Cardio"]
const days: DayOfWeek[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

type ClassScheduleFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  classToEdit?: ClassSchedule | null
  onSave: (data: Omit<ClassSchedule, "id">, id?: string) => void
}

export default function ClassScheduleFormDialog({
  open,
  onOpenChange,
  classToEdit,
  onSave,
}: ClassScheduleFormDialogProps) {
  const instructors = mockInstructors

  const [form, setForm] = useState({
    name: classToEdit?.name ?? "",
    description: classToEdit?.description ?? "",
    category: classToEdit?.category ?? ("HIIT" as ClassCategory),
    instructorId: classToEdit?.instructorId ?? "",
    dayOfWeek: classToEdit?.dayOfWeek ?? ("Lunes" as DayOfWeek),
    startTime: classToEdit?.startTime ?? "08:00",
    durationMinutes: classToEdit ? String(classToEdit.durationMinutes) : "",
    maxCapacity: classToEdit ? String(classToEdit.maxCapacity) : "",
  })

  function updateField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(
      {
        name: form.name,
        description: form.description,
        category: form.category,
        instructorId: form.instructorId,
        dayOfWeek: form.dayOfWeek,
        startTime: form.startTime,
        durationMinutes: Number(form.durationMinutes),
        maxCapacity: Number(form.maxCapacity),
      },
      classToEdit?.id
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{classToEdit ? "Editar Clase" : "Nueva Clase"}</DialogTitle>
          <DialogDescription>
            {classToEdit
              ? "Modificá los datos de la clase seleccionada."
              : "Completá los datos para crear una clase nueva."}
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

          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Select value={form.category} onValueChange={(v) => updateField("category", v as ClassCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Instructor</Label>
              <Select
                value={form.instructorId}
                onValueChange={(v) => updateField("instructorId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elegí un instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name} {i.surname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Día</Label>
              <Select value={form.dayOfWeek} onValueChange={(v) => updateField("dayOfWeek", v as DayOfWeek)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="startTime">Horario</Label>
              <Input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={(e) => updateField("startTime", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="durationMinutes">Duración (min)</Label>
              <Input
                id="durationMinutes"
                type="number"
                min="1"
                value={form.durationMinutes}
                onChange={(e) => updateField("durationMinutes", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="maxCapacity">Cupo máximo</Label>
            <Input
              id="maxCapacity"
              type="number"
              min="1"
              value={form.maxCapacity}
              onChange={(e) => updateField("maxCapacity", e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{classToEdit ? "Guardar cambios" : "Crear clase"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}