import { useState } from 'react'
import { formatPrice } from '../utils/formatPrice.js'

export function ReservationTracker({ onSearch, reservation = null }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [currentResult, setCurrentResult] = useState(reservation)

  function handleChange(event) {
    setSearchTerm(event.target.value)
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = searchTerm.trim()
    if (!trimmed) {
      setErrorMessage('Por favor ingresa un código de reserva o correo electrónico.')
      setCurrentResult(null)
      return
    }

    if (onSearch) {
      const found = onSearch(trimmed)
      if (!found) {
        setErrorMessage('No encontramos ninguna reserva con ese código o correo.')
        setCurrentResult(null)
      } else {
        setErrorMessage('')
        setCurrentResult(found)
      }
    }
  }

  return (
    <div className="reservation-tracker card p-4 shadow-sm border-0 bg-light">
      <div className="card-body">
        <h3 className="card-title h4 mb-2">Consulta el estado de tu reserva</h3>
        <p className="card-text text-muted mb-3">
          Ingresa tu código (ej: <code>RES-20240705</code>) o correo para revisar en tiempo real si tu
          habitación está confirmada o lista para Check-in.
        </p>

        <form onSubmit={handleSubmit} className="row g-2 align-items-center">
          <div className="col-12 col-md-8">
            <label htmlFor="tracker-input" className="visually-hidden">
              Código de reserva o correo
            </label>
            <input
              id="tracker-input"
              type="text"
              className="form-control form-control-lg"
              placeholder="Ej: RES-20240705 o tu@email.com"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-4">
            <button type="submit" className="btn btn-dark btn-lg w-100">
              Consultar estado
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="alert alert-danger mt-3 mb-0" role="alert">
            {errorMessage}
          </div>
        )}

        {currentResult && (
          <div className="reservation-result-card mt-3 p-3 bg-white rounded border">
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <span className="badge bg-primary fs-6">{currentResult.code}</span>
              <span
                className={`badge fs-6 ${
                  currentResult.status === 'Confirmada'
                    ? 'bg-success'
                    : currentResult.status === 'Check-in'
                    ? 'bg-info text-dark'
                    : currentResult.status === 'Check-out'
                    ? 'bg-secondary'
                    : currentResult.status === 'Cancelada'
                    ? 'bg-danger'
                    : 'bg-warning text-dark'
                }`}
              >
                Estado: {currentResult.status}
              </span>
            </div>
            <h4 className="h5 mb-1">{currentResult.roomName || 'Habitación Hotel'}</h4>
            <p className="mb-1 text-muted small">
              Titular: <strong>{currentResult.customerName}</strong> ({currentResult.email})
            </p>
            {currentResult.nights && (
              <p className="mb-1 text-muted small">
                Estadía: <strong>{currentResult.nights} noches</strong>
              </p>
            )}
            <p className="mb-0 fw-bold text-success">
              Total pagado: {formatPrice(currentResult.total)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
