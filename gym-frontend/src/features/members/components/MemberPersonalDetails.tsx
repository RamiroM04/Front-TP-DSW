import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import type { Member } from '@/features/members/models/Member'

function formatDate(date: string | undefined | null) {
  if (!date) return '-'
  const parsed = new Date(date)
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

interface MemberPersonalDetailsProps {
  member: Member
}

export function MemberPersonalDetails({ member }: MemberPersonalDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información personal</CardTitle>
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
              N° de documento ({member.docType})
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
        </div>
      </CardContent>
    </Card>
  )
}

export default MemberPersonalDetails
