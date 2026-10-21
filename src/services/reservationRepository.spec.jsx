import {
  createReservation,
  deleteReservation,
  findReservationByCode,
  getReservations,
  resetReservationsForTests,
  updateReservationStatus,
} from './reservationRepository.js'
import { initialReservations } from '../data/products.js'

describe('reservationRepository', () => {
  beforeEach(() => {
    resetReservationsForTests()
  })

  it('retrieves initial sample reservations when storage is empty', () => {
    expect(getReservations()).toEqual(initialReservations)
  })

  it('creates and persists a new reservation with a generated code', () => {
    const reservation = createReservation({
      customerName: 'Valeria Soto',
      email: 'valeria@example.com',
      roomName: 'Habitación Superior',
      nights: 2,
      total: 218000,
    })

    expect(reservation.code).toBeDefined()
    expect(reservation.status).toBe('Confirmada')
    expect(getReservations().some((item) => item.code === reservation.code)).toBeTrue()
  })

  it('updates reservation status correctly in persistence', () => {
    const updated = updateReservationStatus('RES-20240705', 'Check-in')
    expect(updated.status).toBe('Check-in')
    expect(getReservations().find((item) => item.code === 'RES-20240705').status).toBe('Check-in')
  })

  it('finds an existing reservation by code or email', () => {
    const foundByCode = findReservationByCode('RES-20240705')
    expect(foundByCode).not.toBeNull()
    expect(foundByCode.customerName).toBe('Pedro Becker')

    const foundByEmail = findReservationByCode('pedro.becker20@example.com')
    expect(foundByEmail).not.toBeNull()
    expect(foundByEmail.code).toBe('RES-20240705')

    const notFound = findReservationByCode('RES-INEXISTENTE')
    expect(notFound).toBeNull()
  })

  it('throws an error when attempting to update a missing reservation', () => {
    expect(() => updateReservationStatus('RES-9999999', 'Cancelada')).toThrowError(
      'No se encontró la reserva indicada.',
    )
  })

  it('deletes an existing reservation', () => {
    const listBefore = getReservations()
    const remaining = deleteReservation('RES-20240708')
    expect(remaining.length).toBe(listBefore.length - 1)
    expect(remaining.some((item) => item.code === 'RES-20240708')).toBeFalse()
  })
})
