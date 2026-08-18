import type { ClassSchedule } from "../models/ClassSchedule"

export const mockClasses: ClassSchedule[] = [
  {
    id: "class-hiit",
    name: "HIIT Warriors",
    description: "Entrenamiento de alta intensidad por intervalos.",
    category: "HIIT",
    instructorId: "1", // Marcus Ríos
    dayOfWeek: "Martes",
    startTime: "08:00",
    durationMinutes: 45,
    maxCapacity: 12,
  },
  {
    id: "class-strength",
    name: "Strength Builder",
    description: "Trabajo de fuerza con pesas libres y máquinas.",
    category: "Strength",
    instructorId: "2", // Sarah Gómez
    dayOfWeek: "Martes",
    startTime: "09:30",
    durationMinutes: 60,
    maxCapacity: 15,
  },
  {
    id: "class-zen",
    name: "Zen Flow",
    description: "Yoga y estiramiento para flexibilidad y relajación.",
    category: "Zen",
    instructorId: "3", // Emily Torres
    dayOfWeek: "Martes",
    startTime: "11:00",
    durationMinutes: 50,
    maxCapacity: 10,
  },
  {
    id: "class-cardio",
    name: "Cardio Blast",
    description: "Rutina cardiovascular de alta energía.",
    category: "Cardio",
    instructorId: "4", // Alex Funes
    dayOfWeek: "Martes",
    startTime: "12:30",
    durationMinutes: 40,
    maxCapacity: 20,
  },
]