import { useState } from 'react';
import { User, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

// --- Mock Data ---
const DATES = [
  { day: 'LUN', date: '15' },
  { day: 'MAR', date: '16', active: true },
  { day: 'MIE', date: '17' },
  { day: 'JUE', date: '18' },
  { day: 'VIE', date: '19' },
];

const CATEGORIES = ['Todos', 'HIIT', 'Strength', 'Zen', 'Cardio'];

const CLASSES = [
  {
    id: 1,
    title: 'HIIT Warriors',
    coach: 'Coach Marcus',
    time: '08:00',
    duration: '45 min',
    capacity: '8/12 Cupos',
    status: 'RESERVADO',
    type: 'HIIT'
  },
  {
    id: 2,
    title: 'Strength Builder',
    coach: 'Coach Sarah',
    time: '09:30',
    duration: '60 min',
    capacity: '10/15 Cupos',
    status: 'STRENGTH',
    type: 'Strength'
  },
  {
    id: 3,
    title: 'Zen Flow',
    coach: 'Coach Emily',
    time: '11:00',
    duration: '50 min',
    capacity: '5/10 Cupos',
    status: 'ZEN',
    type: 'Zen'
  },
  {
    id: 4,
    title: 'Cardio Blast',
    coach: 'Coach Alex',
    time: '12:30',
    duration: '40 min',
    capacity: '12/20 Cupos',
    status: 'CARDIO',
    type: 'Cardio'
  }
];

export default function ClassesPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  return (
    <div>

      {/* Contenedor centralizado para no desbordar en pantallas ultra anchas */}
      <div className="max-w-7xl mx-auto">
        {/* --- TÍTULO SECCIÓN --- */}
        <section className="px-4 py-2 md:px-8">
          <h2 className="text-4xl font-extrabold leading-tight mb-2">Reserva de Clases</h2>
          <p >Encontrá tu próximo desafío.</p>
        </section>

        {/* --- SELECTOR DE FECHAS (Scroll Horizontal Aislado) --- */}
        <section className="mt-6 px-4 md:px-8">
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
            {DATES.map((d, index) => (
              <Button
                key={index}
                className={"shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl transition-colors"}
                variant={d.active ? "default" : "secondary"}
              >
                <span className="text-xs font-semibold mb-1">{d.day}</span>
                <span className="text-2xl font-bold">{d.date}</span>
              </Button>
            ))}
          </div>
        </section>

        {/* --- FILTRO DE CATEGORÍAS (Scroll Horizontal Aislado) --- */}
        <section className="mt-6 px-4 md:px-8">
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 px-6 py-2 rounded-full text-sm font-semibold"
                variant={activeCategory === cat ? "default" : "secondary"}
              >
                {cat}
              </Button>
            ))}
          </div>
        </section>

        {/* --- LISTA DE CLASES (Grid Responsivo) --- */}
        <main className="mt-8 px-4 md:px-8">
          {/* Aquí aplicamos de Columna a Cuadrícula: flex-col en mobile, grid en md y lg */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CLASSES.map((cls) => (
              <Card key={cls.id} className="border-none flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      className="uppercase text-[10px] font-bold tracking-wider"
                      variant={cls.status === 'RESERVADO' ? "secondary" : "default"}
                    >
                      {cls.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-xl font-bold">{cls.time}</p>
                      <p className="text-xs flex items-center justify-end gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {cls.duration}
                      </p>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{cls.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>{cls.coach}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="h-px w-full my-4" />
                </CardContent>

                <CardFooter className="flex justify-between items-center pb-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="w-4 h-4" />
                    <span>{cls.capacity}</span>
                  </div>
                  <Button
                    variant={cls.status === 'RESERVADO' ? "secondary" : "default"}
                    className={cls.status === 'RESERVADO'
                      ? "border-none"
                      : "font-bold"
                    }
                  >
                    {cls.status === 'RESERVADO' ? 'Cancelar' : 'Reservar'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>

      </div >

    </div >
  );
}