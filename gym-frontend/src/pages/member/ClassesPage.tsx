import ClassDateSelector from '@/features/classes/components/ClassDateSelector'
import ClassCategoryFilter from '@/features/classes/components/ClassCategoryFilter'
import ClassCard from '@/features/classes/components/ClassCard'
import { useMemberClasses } from '@/features/classes/hooks/useMemberClasses'

export default function ClassesPage() {
  const {
    dates,
    categories,
    activeCategory,
    setActiveCategory,
    selectedDate,
    setSelectedDate,
    classes,
    handleToggleReservation,
  } = useMemberClasses()

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <section className="px-4 py-2 md:px-8">
          <h2 className="text-4xl font-extrabold leading-tight mb-2">Reserva de Clases</h2>
          <p>Encontrá tu próximo desafío.</p>
        </section>

        <ClassDateSelector
          dates={dates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <ClassCategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <main className="mt-8 px-4 md:px-8">
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {classes.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                onToggleReservation={handleToggleReservation}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}