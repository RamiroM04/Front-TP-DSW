import type { Instructor } from "@/models/Instructor"

// Busca el nombre completo de un instructor por su id, en una lista ya cargada.
export function getInstructorName(instructors: Instructor[], instructorId: string): string {
  const found = instructors.find((i) => i.id === instructorId)
  return found ? `${found.name} ${found.surname}` : "Sin asignar"
}