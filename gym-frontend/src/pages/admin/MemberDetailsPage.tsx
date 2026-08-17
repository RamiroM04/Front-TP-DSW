import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RiEditLine } from '@remixicon/react'

import BreadCrumb from '@/components/BreadCrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

import type { Member } from '@/models/Member'
import { type Membership } from '@/models/Membership'
import { memberService } from '@/services/memberService'
import { membershipService } from '@/services/membershipService'
import { membershipPlanService } from '@/services/membershipPlanService'
import { type MembershipPlan } from '@/models/MembershipPlan'

const statusVariant = {
  ACTIVE: 'default',
  INACTIVE: 'secondary',
} as const

function formatDate(date: string | undefined | null) {
  if (!date) return '-'
  const parsed = new Date(date)
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

export default function MemberDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [member, setMember] = useState<Member | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [plan, setPlan] = useState<MembershipPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMemberDetails = async () => {
      try {
        setLoading(true)

        if (!id) {
          toast.error('ID de miembro no válido')
          navigate('/administrativo/socios')
          return
        }

        const memberData = await memberService.getMemberById(Number(id))
        setMember(memberData)

        const membershipData = await membershipService.getMembershipByMemberId(
          Number(id)
        )
        setMembership(membershipData)

        const planData = await membershipPlanService.getMembershipPlanById(
          membershipData.membershipPlanId
        )
        setPlan(planData)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar perfil'
        toast.error(errorMessage)
        navigate('/administrativo/socios')
      } finally {
        setLoading(false)
      }
    }

    loadMemberDetails()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="space-y-4">
        <BreadCrumb />
        <div className="rounded-xl border bg-background px-4 py-6 sm:px-6 text-center">
          <p>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!member || !membership) {
    return (
      <div className="space-y-4">
        <BreadCrumb />
        <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          No se encontró el perfil del socio.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BreadCrumb />

      <Card className="border bg-background/95">
        <CardContent className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {member.name} {member.surname}
                </h1>
                <Badge
                  variant={
                    statusVariant[member.status as keyof typeof statusVariant]
                  }
                >
                  {member.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                ID: #{member.id}
              </p>
            </div>

            <Button
              size="default"
              className="w-full sm:w-auto sm:px-5"
              onClick={() => navigate(`/administrativo/socios/editar/${member.id}`)}
            >
              <RiEditLine className="size-4" aria-hidden="true" />
              Editar perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(250px,1fr)] lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle>Detalles personales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Email
                </p>
                <p className="text-sm font-medium">{member.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Teléfono
                </p>
                <p className="text-sm font-medium">{member.phone || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Tipo de documento
                </p>
                <p className="text-sm font-medium">{member.docType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Nº de documento
                </p>
                <p className="text-sm font-medium">{member.docNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Fecha de nacimiento
                </p>
                <p className="text-sm font-medium">
                  {formatDate(member.birthDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Socio desde
                </p>
                <p className="text-sm font-medium">{formatDate(member.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membresía actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1">
              <p className="text-2xl font-semibold tracking-tight">
                {plan?.name || 'Plan no disponible'}
              </p>
              <p className="text-sm text-muted-foreground">
                {plan?.description || '-'}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/35 p-3 space-y-2">
              <div className="mb-1 flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Activación</span>
                  <span className="font-semibold">
                    {formatDate(membership.startDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Próximo vencimiento</span>
                  <span className="font-semibold">
                    {formatDate(membership.endDate)}
                  </span>
                </div>
              </div>
              {(membership.lastPaymentMethod || membership.lastPaymentAmount) && (
                <div className="border-t pt-2 space-y-1">
                  {membership.lastPaymentMethod && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Último pago</span>
                      <span className="font-semibold">
                        {formatDate(membership.lastPaymentDate)}
                      </span>
                    </div>
                  )}
                  {membership.lastPaymentAmount && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Monto</span>
                      <span className="font-semibold">
                        ${membership.lastPaymentAmount.toLocaleString('es-AR')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Badge variant="outline" className="w-full justify-center py-2">
              {membership.status === 'ACTIVE' ? 'Membresía Activa' : 'Membresía Vencida'}
            </Badge>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}