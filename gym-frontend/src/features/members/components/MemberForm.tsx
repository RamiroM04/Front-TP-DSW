import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { User } from "lucide-react"
import { useState } from "react"
import { type Member, type CreateMemberInput, type UpdateMemberInput, type DocType, type Status } from "../models/Member.ts"

type MemberFormProps = {
  showActions?: boolean
  member?: Member
  onSubmit: (data: CreateMemberInput | UpdateMemberInput) => Promise<void>
}

export default function MemberForm({
  member,
  onSubmit,
}: MemberFormProps) {
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
      [name]: name === 'membershipPlanId' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

    // errors are surfaced via toast by the submit handler passed in
    await onSubmit(dataToSubmit)
  }

  return (
    <form id="member-form" onSubmit={handleSubmit} className="rounded-xl border bg-background px-4 py-2 items-baseline sm:px-6 sm:py-6">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <User className="size-5" aria-hidden="true" />
        {member ? 'Editar socio' : 'Información del socio'}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="name"
            name="name"
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
            value={formData.docNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="docType" className="text-sm font-medium">
            Tipo de documento
          </label>
          <Select
            value={formData.docType}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, docType: val as DocType }))
            }
          >
            <SelectTrigger id="docType" className="w-full">
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DNI">DNI</SelectItem>
              <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
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
            value={formData.phone || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Estado
          </label>
          <Select
            value={formData.status}
            onValueChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                status: val as Status,
              }))
            }
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Activo</SelectItem>
              <SelectItem value="INACTIVE">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

    </form>
  )
}
