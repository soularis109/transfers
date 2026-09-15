const priceFormatter = new Intl.NumberFormat('uk-UA')

export function formatPrice(price: number): string {
  return `${priceFormatter.format(price)} $`
}
