import type { MembershipPlan } from "../models/MembershipPlan"

export const mockPlans: MembershipPlan[] = [
  {
    id: 1,
    name: "Plan Básico",
    price: 28000,
    durationDays: 30,
    description: "Acceso libre a sala de musculación.",
  },
  {
    id: 2,
    name: "Plan Plus",
    price: 36000,
    durationDays: 30,
    description: "Musculación + clases grupales.",
  },
  {
    id: "MOCKplan-premium",
    name: "Plan Premium",
    price: 49000,
    durationDays: 30,
    description: "Todos los beneficios + seguimiento personalizado.",
  },
]