const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatPrice(value: number): string {
  return currency.format(value)
}

export function getDiscountPercent(
  price: number,
  compareAtPrice?: number,
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) {
    return null
  }

  return Math.round((1 - price / compareAtPrice) * 100)
}
