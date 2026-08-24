import { useNavigate } from 'react-router-dom'
import MembersDataTable from '@/features/members/components/MembersDataTable'
import MembersHeader from '@/features/members/components/MembersHeader'
import { useMembers } from '@/features/members/hooks/useMembers'

export default function MembersPage() {
  const navigate = useNavigate()
  const {
    members,
    loading,
    error,
    activeCount,
    inactiveCount,
    totalCount,
    handleDelete,
  } = useMembers()

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

  return (
    <div className="space-y-4">
      <MembersHeader
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        totalCount={totalCount}
        onNew={() => navigate('/administrativo/socios/nuevo')}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:px-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="rounded-xl border bg-background px-4 py-2 sm:px-6 sm:py-6">
        <MembersDataTable
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
