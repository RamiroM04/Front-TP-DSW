import { type ClassSchedule, type ClassCategory } from '../models/ClassSchedule'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

const initialMemberClasses: ClassSchedule[] = [
  {
    id: '1',
    name: 'HIIT Warriors',
    description: 'Entrenamiento de alta intensidad por intervalos.',
    category: 'HIIT',
    instructorId: '1',
    instructorName: 'Coach Marcus',
    dayOfWeek: 'Martes',
    startTime: '08:00',
    durationMinutes: 45,
    maxCapacity: 12,
    currentCapacity: 8,
    reserved: true,
    status: 'RESERVADO',
  },
  {
    id: '2',
    name: 'Strength Builder',
    description: 'Trabajo de fuerza con pesas libres y máquinas.',
    category: 'Strength',
    instructorId: '2',
    instructorName: 'Coach Sarah',
    dayOfWeek: 'Martes',
    startTime: '09:30',
    durationMinutes: 60,
    maxCapacity: 15,
    currentCapacity: 10,
    reserved: false,
    status: 'STRENGTH',
  },
  {
    id: '3',
    name: 'Zen Flow',
    description: 'Yoga y estiramiento para flexibilidad y relajación.',
    category: 'Zen',
    instructorId: '3',
    instructorName: 'Coach Emily',
    dayOfWeek: 'Martes',
    startTime: '11:00',
    durationMinutes: 50,
    maxCapacity: 10,
    currentCapacity: 5,
    reserved: false,
    status: 'ZEN',
  },
  {
    id: '4',
    name: 'Cardio Blast',
    description: 'Rutina cardiovascular de alta energía.',
    category: 'Cardio',
    instructorId: '4',
    instructorName: 'Coach Alex',
    dayOfWeek: 'Martes',
    startTime: '12:30',
    durationMinutes: 40,
    maxCapacity: 20,
    currentCapacity: 12,
    reserved: false,
    status: 'CARDIO',
  },
]

let memoryClasses: ClassSchedule[] = [...initialMemberClasses]

export const classService = {
  async getAll(): Promise<ClassSchedule[]> {
    try {
      const response = await fetch(`${baseUrl}/api/classes`)
      if (response.ok) {
        return response.json()
      }
    } catch {
      // Fallback
    }
    return memoryClasses
  },

  async getById(id: string): Promise<ClassSchedule> {
    try {
      const response = await fetch(`${baseUrl}/api/classes/${id}`)
      if (response.ok) {
        return response.json()
      }
    } catch {
      // Fallback
    }
    const found = memoryClasses.find((c) => c.id === id)
    if (!found) throw new Error('Clase no encontrada')
    return found
  },

  async create(data: Partial<ClassSchedule>): Promise<ClassSchedule> {
    try {
      const response = await fetch(`${baseUrl}/api/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        return response.json()
      }
    } catch {
      // Fallback
    }
    const newClass: ClassSchedule = {
      id: String(Date.now()),
      name: data.name || 'Nueva Clase',
      description: data.description || '',
      category: (data.category as ClassCategory) || 'HIIT',
      instructorId: data.instructorId || '1',
      dayOfWeek: data.dayOfWeek || 'Lunes',
      startTime: data.startTime || '08:00',
      durationMinutes: data.durationMinutes || 45,
      maxCapacity: data.maxCapacity || 10,
    }
    memoryClasses.push(newClass)
    return newClass
  },

  async update(id: string, data: Partial<ClassSchedule>): Promise<ClassSchedule> {
    try {
      const response = await fetch(`${baseUrl}/api/classes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        return response.json()
      }
    } catch {
      // Fallback
    }
    memoryClasses = memoryClasses.map((c) => (c.id === id ? { ...c, ...data } : c))
    const updated = memoryClasses.find((c) => c.id === id)
    if (!updated) throw new Error('Clase no encontrada')
    return updated
  },

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${baseUrl}/api/classes/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        return
      }
    } catch {
      // Fallback
    }
    memoryClasses = memoryClasses.filter((c) => c.id !== id)
  },

  async toggleReservation(id: string): Promise<ClassSchedule> {
    try {
      const response = await fetch(`${baseUrl}/api/classes/${id}/reserve`, {
        method: 'POST',
      })
      if (response.ok) {
        return response.json()
      }
    } catch {
      // Fallback
    }

    memoryClasses = memoryClasses.map((item) => {
      if (item.id === id) {
        const isReserved = item.reserved || item.status === 'RESERVADO'
        const newReserved = !isReserved
        const currentCap = item.currentCapacity ?? 0
        const newCap = newReserved ? currentCap + 1 : Math.max(0, currentCap - 1)
        return {
          ...item,
          reserved: newReserved,
          status: newReserved ? 'RESERVADO' : item.category.toUpperCase(),
          currentCapacity: newCap,
        }
      }
      return item
    })

    const updated = memoryClasses.find((c) => c.id === id)
    if (!updated) throw new Error('Clase no encontrada')
    return updated
  },
}
