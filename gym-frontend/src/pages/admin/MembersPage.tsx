import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiAddLine } from '@remixicon/react'
import { memberService } from '@/services/memberService'
import SociosDataTable from '@/components/SociosDataTable'
import { toast } from 'sonner'
import { type ExtendedMember } from '../../models/ExtendedMember'
import { useNavigate } from 'react-router-dom'
import { membershipPlanService } from '@/services/membershipPlanService'
import { membershipService } from '@/services/membershipService'
export default function MembersPage(){
  const navigate = useNavigate()
  const [members, setMembers] = useState<ExtendedMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await memberService.getAllMembers()
        const extendedMembers: ExtendedMember[] = await Promise.all(
          data.map(async (member) => {
            try{
              const membership = await membershipService.getMembershipByMemberId(member.id);
              const plan = await membershipPlanService.getMembershipPlanById(membership.membershipPlanId);
              return{
                ...member,
                plan: plan.name,
                nextExpiration: membership.endDate,
              }
            }catch(err){
              console.error(`Error al obtener datos del miembro ${member.id}: `, err)
              return{
                ...member,
                plan: 'Plan no disponible',
                nextExpiration: member.createdAt,
              }
            }
          })
        )

        setMembers(extendedMembers)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    loadMembers()
},[])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este miembro?')) return
    try {
      await memberService.delete(id)
      toast.success('Miembro eliminado exitosamente')
      
      const updated= await memberService.getAllMembers()
      const extendedMembers: ExtendedMember[] = await Promise.all(
        updated.map(async (member) => {
          try{
            const membership = await membershipService.getMembershipByMemberId(member.id);
            const plan = await membershipPlanService.getMembershipPlanById(membership.membershipPlanId);
            return{
              ...member,
              plan: plan.name,
              nextExpiration: membership.endDate,
            }
          } catch{
            return{
              ...member,
              plan: 'Plan no disponible',
              nextExpiration: member.createdAt,
            }
          }
        })
      )
      setMembers(extendedMembers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(errorMessage)
    }
  }

  // Si está cargando
  if (loading) {
    return (
      <div className="space-y-4">
        <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Directorio de Miembros
          </h1>
        </section>
        <div className="rounded-xl border bg-background px-4 py-6 sm:px-6 text-center">
          <p>Cargando miembros...</p>
        </div>
      </div>
    )
  }
  const activeCount = members.filter((m) => m.status === 'ACTIVE').length
  const inactiveCount = members.filter((m) => m.status === 'INACTIVE').length

  return(
    <div className="space-y-4">
      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Directorio de socios
              </h1>
              <p className="max-w-2xl text-sm sm:text-base">
                Gestiona los socios. Podes agregar, editar o eliminar socios según sea necesario.
              </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
              Socios activos: {activeCount}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
              Socios inactivos: {inactiveCount}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
              Total: {members.length}
            </Badge>
          </div>
        </div>

        <Button
        size="default"
        className="w-full md:w-auto md:px-5" 
        onClick={() => navigate('/administrativo/socios/nuevo')}>
          <RiAddLine className="mr-1 size-3.5" aria-hidden="true"/>
          Nuevo Socio
        </Button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:px-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <SociosDataTable
        initialData={members}
        title="Listado de Socios"
        subtitle="Socios registrados en el sistema"
      onEdit={(id) => navigate(`/administrativo/socios/editar/${id}`)}
        onDelete={handleDelete}
        />
        </div>
        </div>
  )
}






// import SociosDataTable from "@/components/SociosDataTable"
// import { mockMembers } from "@/services/mockMembers"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { RiAddLine } from "@remixicon/react"
// import { Link } from "react-router-dom"

// export default function SociosPage() {
//   return (
//     <div className="space-y-4">
//       <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
//         <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
//           <div className="space-y-3">
//             <div className="space-y-1.5">
//               <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
//                 Directorio de Socios
//               </h1>
//               <p className="max-w-2xl text-sm sm:text-base">
//                 Gestiona los socios y sus planes. Podes agregar, editar o eliminar socios según sea necesario.
//               </p>
//             </div>
//             <div className="flex flex-wrap items-center gap-2">
//               <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
//                 Socios activos: 142
//               </Badge>
//               <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
//                 Planes vencidos: 8
//               </Badge>
//               <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
//                 Nuevas inscripciones este mes: +24
//               </Badge>
//             </div>
//           </div>

//           <Button size="default" className="w-full md:w-auto md:px-5" asChild>
//             <Link to="/administrativo/socios/nuevo">
//               <RiAddLine className="mr-1 size-3.5" aria-hidden="true" />
//               Nuevo Socio
//             </Link>
//           </Button>
//         </div>
//       </section>

//       <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
//         <SociosDataTable title="Listado de Socios" subtitle="Socios registrados en el sistema" initialData={mockMembers} />
//       </div>
//     </div>
//   )
// } */}
