import { initialReservations } from '../data/products.js'

const RESERVATIONS_STORAGE_KEY = 'descanso-total.reservations'

export function getReservations() {
  const saved = localStorage.getItem(RESERVATIONS_STORAGE_KEY)
  if (saved === null) return initialReservations

  try {
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return initialReservations
    return parsed
  } catch {
    return initialReservations
  }
}

function saveReservations(reservations) {
  localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations))
}

export function createReservation(data) {
  const reservations = getReservations()
  const code = data.code || `RES-${Date.now().toString().slice(-7)}`
  const newReservation = {
    ...data,
    id: data.id || code,
    code,
    status: data.status || 'Confirmada',
    createdAt: data.createdAt || new Date().toISOString(),
  }
  saveReservations([newReservation, ...reservations])
  return newReservation
}

export function updateReservationStatus(id, status) {
  const reservations = getReservations()
  const exists = reservations.some((res) => res.id === id || res.code === id)
  if (!exists) {
    throw new Error('No se encontró la reserva indicada.')
  }
  const updated = reservations.map((res) =>
    res.id === id || res.code === id ? { ...res, status } : res,
  )
  saveReservations(updated)
  return updated.find((res) => res.id === id || res.code === id)
}

export function findReservationByCode(term) {
  if (!term) return null
  const clean = term.trim().toLowerCase()
  const reservations = getReservations()
  return (
    reservations.find((res) => {
      const code = String(res?.code ?? '').toLowerCase()
      const id = String(res?.id ?? '').toLowerCase()
      const email = String(res?.email ?? '').toLowerCase()
      return code === clean || id === clean || email === clean
    }) || null
  )
}

export function deleteReservation(id) {
  const reservations = getReservations()
  const filtered = reservations.filter((res) => res.id !== id && res.code !== id)
  if (filtered.length === reservations.length) {
    throw new Error('No se encontró la reserva a eliminar.')
  }
  saveReservations(filtered)
  return filtered
}

export function resetReservationsForTests() {
  localStorage.removeItem(RESERVATIONS_STORAGE_KEY)
}
