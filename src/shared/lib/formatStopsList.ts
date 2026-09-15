export function formatStopsList(stops: string[]): string {
  return stops.length > 0 ? stops.join(', ') : '—'
}
