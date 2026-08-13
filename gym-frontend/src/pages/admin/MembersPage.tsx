import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiAddLine } from '@remixicon/react'
import { Link } from 'react-router-dom'
import { type CreateMemberInput, type Member, type UpdateMemberInput } from '../../models/Member'
import { memberService } from '@/services/memberService'
import MemberForm from '../../components/admin/MemberForm'
import { toast } from 'sonner'

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  // Cargar miembros al montar
  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await memberService.getAllMembers()
        setMembers(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadMembers()
  }, [])

  const handleCreate = async (data: CreateMemberInput) => {
    try {
      await memberService.create(data)
      setShowForm(false)
      toast.success('Miembro creado exitosamente')
      
      // Recargar
      const updated = await memberService.getAllMembers()
      setMembers(updated)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear'
      toast.error(errorMessage)
      throw err
    }
  }

  const handleUpdate = async (data: UpdateMemberInput) => {
    if (!editingMember) return
    try {
      await memberService.update(editingMember.id, data)
      setEditingMember(null)
      toast.success('Miembro actualizado exitosamente')
      
      // Recargar
      const updated = await memberService.getAllMembers()
      setMembers(updated)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar'
      toast.error(errorMessage)
      throw err
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este miembro?')) return
    try {
      await memberService.delete(id)
      toast.success('Miembro eliminado exitosamente')
      
      // Recargar
      const updated = await memberService.getAllMembers()
      setMembers(updated)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(errorMessage)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR')
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

  // Si está mostrando formulario
  if (showForm || editingMember) {
    return (
      <div className="space-y-4">
        <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {editingMember ? 'Editar Miembro' : 'Nuevo Miembro'}
          </h1>
        </section>
        <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
          <MemberForm
            member={editingMember || undefined}
            onSubmit={async(data) => {
              if(editingMember){
                await handleUpdate(data as UpdateMemberInput)
              }else{
                await handleCreate(data as CreateMemberInput)
              }
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingMember(null)
            }}
          />
        </div>
      </div>
    )
  }

  const activeCount = members.filter((m) => m.status === 'Activo').length
  const inactiveCount = members.filter((m) => m.status === 'Inactivo').length

  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Directorio de Miembros
              </h1>
              <p className="max-w-2xl text-sm sm:text-base">
                Gestiona los miembros. Podes agregar, editar o eliminar miembros según sea necesario.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                Miembros activos: {activeCount}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                Miembros inactivos: {inactiveCount}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                Total: {members.length}
              </Badge>
            </div>
          </div>

          <Button size="default" className="w-full md:w-auto md:px-5" onClick={() => setShowForm(true)}>
            <RiAddLine className="mr-1 size-3.5" aria-hidden="true" />
            Nuevo Miembro
          </Button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:px-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        {members.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay miembros registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold">Apellido</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Documento</th>
                  <th className="px-4 py-3 text-left font-semibold">Nro Doc</th>
                  <th className="px-4 py-3 text-left font-semibold">Nacimiento</th>
                  <th className="px-4 py-3 text-left font-semibold">Teléfono</th>
                  <th className="px-4 py-3 text-left font-semibold">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">{member.name}</td>
                    <td className="px-4 py-3">{member.surname}</td>
                    <td className="px-4 py-3 text-blue-600">{member.email}</td>
                    <td className="px-4 py-3">{member.docType}</td>
                    <td className="px-4 py-3">{member.docNumber}</td>
                    <td className="px-4 py-3">{formatDate(member.birthDate)}</td>
                    <td className="px-4 py-3">{member.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={member.status === 'Activo' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {member.status === 'Activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
// }
