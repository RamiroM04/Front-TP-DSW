import { useNavigate } from 'react-router-dom'
import { RiEditLine } from '@remixicon/react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { Member } from '@/features/members/models/Member'

const statusVariant = {
  ACTIVE: 'default',
  INACTIVE: 'secondary',
} as const

interface MemberDetailsHeaderProps {
  member: Member
}

export function MemberDetailsHeader({ member }: MemberDetailsHeaderProps) {
  const navigate = useNavigate()

  return (
    <Card className="border bg-background/95">
      <CardContent className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {member.name} {member.surname}
              </h1>
              <Badge variant={statusVariant[member.status as keyof typeof statusVariant]}>
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
  )
}

export default MemberDetailsHeader
