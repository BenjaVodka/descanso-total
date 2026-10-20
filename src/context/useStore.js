import { useContext } from 'react'
import { StoreContext } from './storeContext.js'

export function useStore() {
  const context = useContext(StoreContext)
  if (context === null) throw new Error('useStore debe usarse dentro de StoreProvider.')
  return context
}
