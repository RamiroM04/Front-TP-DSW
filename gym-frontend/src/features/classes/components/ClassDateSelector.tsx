import { Button } from '@/shared/components/ui/button'
import type { ClassDateOption } from '../models/ClassSchedule'

interface ClassDateSelectorProps {
  dates: ClassDateOption[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

export function ClassDateSelector({
  dates,
  selectedDate,
  onSelectDate,
}: ClassDateSelectorProps) {
  return (
    <section className="mt-6 px-4 md:px-8">
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
        {dates.map((d, index) => {
          const isActive = selectedDate === d.date || (d.active && !selectedDate)
          return (
            <Button
              key={index}
              onClick={() => onSelectDate(d.date)}
              className="shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl transition-colors"
              variant={isActive ? 'default' : 'secondary'}
            >
              <span className="text-xs font-semibold mb-1">{d.day}</span>
              <span className="text-2xl font-bold">{d.date}</span>
            </Button>
          )
        })}
      </div>
    </section>
  )
}

export default ClassDateSelector
