export type ClassCategory = "HIIT" | "Strength" | "Zen" | "Cardio"

export type DayOfWeek =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo"

// Forma de una plantilla de clase recurrente (ClassSchedule) en el frontend.
export interface ClassSchedule {
  id: string
  name: string
  description: string
  category: ClassCategory
  instructorId: string   // referencia al id de un Instructor, no una copia de su nombre
  dayOfWeek: DayOfWeek
  startTime: string
  durationMinutes: number
  maxCapacity: number
}