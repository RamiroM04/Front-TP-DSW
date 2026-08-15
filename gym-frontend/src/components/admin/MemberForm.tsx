import { Input } from "@/components/ui/input"
import { User } from "lucide-react"
import { useState } from "react"
import { type Member, type CreateMemberInput, type UpdateMemberInput } from "../../models/Member.ts"
import { type Membership } from "../../models/Membership.ts"

type MemberFormProps = {
  showActions?: boolean
  member?: Member
  membership?: Membership
  onSubmit: (data: CreateMemberInput | UpdateMemberInput) => Promise<void>
  onCancel: () => void
}

export default function MemberForm({ 
  member, 
  onSubmit, 
}: MemberFormProps) {
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateMemberInput>({
    name: member?.name || '',
    surname: member?.surname || '',
    email: member?.email || '',
    phone: member?.phone || '',
    docType: member?.docType || 'DNI',
    docNumber: member?.docNumber || '',
    birthDate: member?.birthDate?.split('T')[0] || '',
    status: member?.status || 'ACTIVE',
    membershipPlanId: 0, 

  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev, 
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const dataToSubmit: CreateMemberInput | UpdateMemberInput = member
        ? {
            name: formData.name, 
            surname: formData.surname,
            email: formData.email, 
            phone: formData.phone, 
            docType: formData.docType, 
            docNumber: formData.docNumber,
            birthDate: formData.birthDate, 
            status: formData.status
          }
        : formData
      
      await onSubmit(dataToSubmit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  return (
    <form id="member-form" onSubmit={handleSubmit} className="rounded-xl border bg-background px-4 py-2 items-baseline sm:px-6 sm:py-6">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <User className="size-5" aria-hidden="true" />
        {member ? 'Editar socio' : 'Información del socio'}
      </h3>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre
          </label>
          <Input 
            id="name" 
            name="name" 
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="surname" className="text-sm font-medium">
            Apellido
          </label>
          <Input 
            id="surname" 
            name="surname" 
            placeholder="Apellido"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="birthDate" className="text-sm font-medium">
            Fecha de nacimiento
          </label>
          <Input 
            id="birthDate" 
            name="birthDate" 
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="docNumber" className="text-sm font-medium">
            Nº de documento
          </label>
          <Input 
            id="docNumber" 
            name="docNumber" 
            placeholder="12345678"
            value={formData.docNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="docType" className="text-sm font-medium">
            Tipo de documento
          </label>
          <select 
            id="docType" 
            name="docType"
            value={formData.docType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="DNI">DNI</option>
            <option value="PASAPORT">Pasaporte</option>
            <option value="CEDULA">Cédula</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Teléfono
          </label>
          <Input 
            id="phone" 
            name="phone" 
            placeholder="+54 9 11 1234 5678"
            value={formData.phone || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Estado
          </label>
          <select 
            id="status" 
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>
      </div>

    </form>
  )
}