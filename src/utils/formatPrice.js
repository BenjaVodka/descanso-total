const pesoFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export function formatPrice(value) {
  return pesoFormatter.format(value)
}
