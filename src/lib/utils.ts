import { eachDayOfInterval, isWeekend, parseISO, differenceInDays } from 'date-fns'

export function calculateTotalPrice(
  checkIn: string,
  checkOut: string,
  weekdayRate: number,
  weekendRate: number | null
): number {
  const start = parseISO(checkIn)
  const end = parseISO(checkOut)
  const nights = differenceInDays(end, start)
  if (nights <= 0) return 0

  const days = eachDayOfInterval({ start, end: new Date(end.getTime() - 1) })
  let total = 0
  for (const day of days) {
    const rate = isWeekend(day) && weekendRate ? weekendRate : weekdayRate
    total += rate
  }
  return total
}

export function formatPeso(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
