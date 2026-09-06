export function formatDate(date: Date | string | undefined | null) {
  if (!date) return '-'
  const parsed = new Date(date)
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}