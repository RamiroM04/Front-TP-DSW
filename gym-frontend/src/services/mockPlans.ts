import type { Plan } from "../models/Plan"

// Datos de prueba en memoria, mientras no está conectado al backend real.
export const mockPlans: Plan[] = [
  {
    id: "plan-basic",
    name: "Plan Básico",
    price: 28000,
    durationDays: 30,
    description: "Acceso libre a sala de musculación.",
  },
  {
    id: "plan-plus",
    name: "Plan Plus",
    price: 36000,
    durationDays: 30,
    description: "Musculación + clases grupales.",
  },
  {
    id: "plan-premium",
    name: "Plan Premium",
    price: 49000,
    durationDays: 30,
    description: "Todos los beneficios + seguimiento personalizado.",
  },
]