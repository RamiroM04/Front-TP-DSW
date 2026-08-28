import { Button } from '@/shared/components/ui/button'
import type { ClassCategory } from '../models/ClassSchedule'

interface ClassCategoryFilterProps {
  categories: ClassCategory[]
  activeCategory: ClassCategory
  onSelectCategory: (category: ClassCategory) => void
}

export function ClassCategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: ClassCategoryFilterProps) {
  return (
    <section className="mt-6 px-4 md:px-8">
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className="shrink-0 px-6 py-2 rounded-full text-sm font-semibold"
            variant={activeCategory === cat ? 'default' : 'secondary'}
          >
            {cat}
          </Button>
        ))}
      </div>
    </section>
  )
}

export default ClassCategoryFilter
