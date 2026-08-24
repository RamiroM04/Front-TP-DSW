export type ClassCategory = "Todos" | "HIIT" | "Strength" | "Zen" | "Cardio"

export type DayOfWeek =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo"

export interface ClassSchedule {
  id: string
  name: string
  description: string
  category: ClassCategory
  instructorId: string
  instructorName?: string
  dayOfWeek: DayOfWeek
  startTime: string
  durationMinutes: number
  maxCapacity: number
  currentCapacity?: number
  reserved?: boolean
  status?: string
}

export interface ClassDateOption {
  day: string
  date: string
  active?: boolean
}