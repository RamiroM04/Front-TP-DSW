import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { type ClassSchedule, type ClassCategory, type ClassDateOption } from '../models/ClassSchedule'
import { classService } from '../api/classService'

const DEFAULT_DATES: ClassDateOption[] = [
  { day: 'LUN', date: '15' },
  { day: 'MAR', date: '16', active: true },
  { day: 'MIE', date: '17' },
  { day: 'JUE', date: '18' },
  { day: 'VIE', date: '19' },
]

const CATEGORIES: ClassCategory[] = ['Todos', 'HIIT', 'Strength', 'Zen', 'Cardio']

export function useMemberClasses() {
  const [classes, setClasses] = useState<ClassSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<ClassCategory>('Todos')
  const [selectedDate, setSelectedDate] = useState<string>('16')

  const loadClasses = async () => {
    try {
      setLoading(true)
      const data = await classService.getAll()
      setClasses(data)
    } catch {
      toast.error('Error al cargar las clases')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClasses()
  }, [])

  const handleToggleReservation = async (id: string) => {
    try {
      const updated = await classService.toggleReservation(id)
      const isNowReserved = updated.reserved || updated.status === 'RESERVADO'
      toast.success(isNowReserved ? 'Reserva confirmada' : 'Reserva cancelada')
      setClasses((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch {
      toast.error('Error al actualizar la reserva')
    }
  }

  const filteredClasses = useMemo(() => {
    if (activeCategory === 'Todos') return classes
    return classes.filter((cls) => cls.category === activeCategory)
  }, [classes, activeCategory])

  return {
    dates: DEFAULT_DATES,
    categories: CATEGORIES,
    activeCategory,
    setActiveCategory,
    selectedDate,
    setSelectedDate,
    classes: filteredClasses,
    loading,
    handleToggleReservation,
  }
}
