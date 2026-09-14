export function formatTime(departureIso: string, durationMinutes: number): string {
  const departure = new Date(departureIso)
  const arrival = new Date(departure.getTime() + durationMinutes * 60_000)

  const format = (date: Date) =>
    `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`

  return `${format(departure)} – ${format(arrival)}`
}
