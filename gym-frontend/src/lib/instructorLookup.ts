import type { Instructor } from "@/models/Instructor"

// Busca el nombre completo de un instructor por su id, en una lista ya cargada.
// Comparamos con String() porque el backend puede devolver el id como número,
// aunque nuestro modelo lo declare como string — evita bugs de comparación.
export function getInstructorName(instructors: Instructor[], instructorId: string): string {
  const found = instructors.find((i) => String(i.id) === String(instructorId))
  return found ? `${found.name} ${found.surname}` : "Sin asignar"
}