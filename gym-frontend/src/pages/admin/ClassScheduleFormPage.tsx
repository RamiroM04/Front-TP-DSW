import { useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockClasses } from "@/services/mockClasses"
import { mockInstructors } from "@/services/mockInstructors"
import type { ClassCategory, ClassSchedule, DayOfWeek } from "@/models/ClassSchedule"

const categories: ClassCategory[] = ["HIIT", "Strength", "Zen", "Cardio"]
const days: DayOfWeek[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

// Formulario de alta/edición de una clase, ahora como página completa.
export default function ClassScheduleFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const location = useLocation()

  // Si venimos a editar, la clase viaja en el "state" de la navegación.
  const classToEdit = (location.state as ClassSchedule | undefined) ?? null
  const isEditing = Boolean(id)

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

  // Actualiza un campo puntual del formulario sin pisar los demás.
  function updateField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Guarda modificando mockClasses directo — mismo array que usa ClassesPage.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const datos: Omit<ClassSchedule, "id"> = {
      name: form.name,
      description: form.description,
      category: form.category,
      instructorId: form.instructorId,
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      durationMinutes: Number(form.durationMinutes),
      maxCapacity: Number(form.maxCapacity),
    }

    if (isEditing && id) {
      const index = mockClasses.findIndex((c) => c.id === id)
      if (index !== -1) mockClasses[index] = { ...mockClasses[index], ...datos }
    } else {
      mockClasses.push({ ...datos, id: crypto.randomUUID() })
    }

    navigate("/administrativo/clases")
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {isEditing ? "Editar Clase" : "Alta de Nueva Clase"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {isEditing
            ? "Modificá los datos de la clase seleccionada."
            : "Completá los datos para crear una clase nueva."}
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Clase</CardTitle>
        </CardHeader>
        <CardContent>
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

            <div className="grid gap-4 sm:grid-cols-2">
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
                <Select value={form.instructorId} onValueChange={(v) => updateField("instructorId", v)}>
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

            <div className="grid gap-4 sm:grid-cols-3">
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

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/administrativo/clases")}>
                Cancelar
              </Button>
              <Button type="submit">{isEditing ? "Guardar cambios" : "Crear clase"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}