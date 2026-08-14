import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"
import { useState, useEffect } from "react"
import { type Member, type CreateMemberInput, type UpdateMemberInput } from "../../models/Member.ts"
import { type MembershipPlan } from "../../models/MembershipPlan.ts"
type MemberFormProps = {
  showActions?: boolean
  member? : Member
  onSubmit: (data: CreateMemberInput | UpdateMemberInput) => Promise<void>
  onCancel: () => void
}

export default function MemberForm({ 
  showActions = true, member, onSubmit, onCancel}: MemberFormProps) {
    const [plans, setPlans] = useState<MembershipPlan[]>([])
    const [loading, setLoading] = useState(false)
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

    useEffect(() => {
      const fetchPlans = async() => {
        try{
          const response = await fetch('/api/membership-plans')
          const data = await response.json()
          setPlans(data)
        }catch(err){
          console.error('Error fetching plans:', err)
        }
      }
      fetchPlans()
    }, [])

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const {name, value} = e.target
      setFormData((prev) => ({
        ...prev, 
        [name]: name === 'membershipPlanId' ? parseInt(value) : value,
      }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)

      try{
        await onSubmit(formData)
      }catch(err){
        setError(err instanceof Error ? err.message: 'Error desconocido')
      }finally{
        setLoading(false)
      }
    }

    return (
      <form onSubmit= {handleSubmit} className= "rounded-xl border bg-background px-4 py-2 items-baseline sm:px-6 sm:py-6">
        <h3 className= "mb-2 flex items-center gap-2 text-lg font-semibold">
          <User className = "size-5" aria-hidden= "true" />
          {member ? 'Editar socio' : 'Informacion del socio'}
            </h3>
            
            {error &&(
              <div className = "mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
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
          <label htmlFor="membershiPlanId" className= "text-sm font-medium">
            Plan*
          </label>
          <select
          id="membershipPlanId"
          name="membershipPlanId"
          value={formData.membershipPlanId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
          >
            <option value="">Seleccione un plan</option>
            {plans.map((plan)=> (
              <option key = {plan.id} value={plan.id}>
                {plan.name} - ${plan.price}
              </option>
            ))}
            </select>
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
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

            {showActions && (
        <div className="flex justify-end gap-2 py-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      )}
    </form>
  )
}
    {/* 

        </div>




        <div className="space-y-2">
          <label htmlFor="fechaNacimiento" className="text-sm font-medium">
            Fecha de nacimiento
          </label>
          <Input id="fechaNacimiento" name="fechaNacimiento" type="date" />
        </div>

        <div className="space-y-2">
          <label htmlFor="nro_doc" className="text-sm font-medium">
            Nº de documento
          </label>
          <Input id="nro_doc" name="nro_doc" placeholder="12345678" />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" />
        </div>

        <div className="space-y-2">
          <label htmlFor="telefono" className="text-sm font-medium">
            Teléfono
          </label>
          <Input id="telefono" name="telefono" placeholder="+54 9 11 1234 5678" />
        </div>
      </div>

      {showActions && (
        <div className="flex justify-end gap-2 py-4">
          <Button variant="outline" type="button">
            Cancelar
          </Button>
          <Button type="submit">
            Guardar
          </Button>
        </div>
      )}
    </form>
  ) */}

