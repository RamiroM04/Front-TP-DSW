import { User, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import type { ClassSchedule } from '../models/ClassSchedule'

interface ClassCardProps {
  cls: ClassSchedule
  onToggleReservation: (id: string) => void
}

export function ClassCard({ cls, onToggleReservation }: ClassCardProps) {
  const isReserved = cls.reserved || cls.status === 'RESERVADO'
  const capacityText = `${cls.currentCapacity ?? 0}/${cls.maxCapacity} Cupos`

  return (
    <Card className="border-none flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge
            className="uppercase text-[10px] font-bold tracking-wider"
            variant={isReserved ? 'secondary' : 'default'}
          >
            {cls.status || cls.category}
          </Badge>
          <div className="text-right">
            <p className="text-xl font-bold">{cls.startTime}</p>
            <p className="text-xs flex items-center justify-end gap-1 mt-1">
              <Clock className="w-3 h-3" /> {cls.durationMinutes} min
            </p>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{cls.name}</CardTitle>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <User className="w-4 h-4" />
          <span>{cls.instructorName || `Coach ${cls.instructorId}`}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-px w-full my-4" />
      </CardContent>

      <CardFooter className="flex justify-between items-center pb-5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Users className="w-4 h-4" />
          <span>{capacityText}</span>
        </div>
        <Button
          onClick={() => onToggleReservation(cls.id)}
          variant={isReserved ? 'secondary' : 'default'}
          className={isReserved ? 'border-none' : 'font-bold'}
        >
          {isReserved ? 'Cancelar' : 'Reservar'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ClassCard
