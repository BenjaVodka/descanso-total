import { useState } from 'react'
import { categories } from '../data/products.js'
import { useStore } from '../context/useStore.js'
import { formatPrice } from '../utils/formatPrice.js'

const emptyForm = {
  name: '',
  category: categories[0],
  price: '',
  offerPrice: '',
  stock: '',
  image: '',
  description: '',
}

export function AdminPage() {
  const { products, addProduct, editProduct, removeProduct } = useStore()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function startEditing(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      offerPrice: product.offerPrice ? String(product.offerPrice) : '',
      stock: String(product.stock),
      image: product.image,
      description: product.description,
    })
    setError('')
    setNotice('')
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  function submitProduct(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    const price = Number(form.price)
    const offerPrice = form.offerPrice ? Number(form.offerPrice) : null
    const stock = Number(form.stock)
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setError('Ingresa un precio mayor que cero y un stock igual o mayor que cero.')
      return
    }
    if (offerPrice !== null && (!Number.isFinite(offerPrice) || offerPrice <= 0 || offerPrice >= price)) {
      setError('El precio de oferta debe ser mayor que cero y menor que el precio normal.')
      return
    }

    const product = { ...form, price, offerPrice, stock }
    try {
      if (editingId) {
        editProduct(editingId, product)
        setNotice('Producto actualizado correctamente.')
      } else {
        addProduct(product)
        setNotice('Producto agregado correctamente.')
      }
      resetForm()
    } catch (caughtError) {
      setError(caughtError.message)
    }
  }

  function deleteSelectedProduct(product) {
    if (!window.confirm(`¿Eliminar "${product.name}" del catálogo?`)) return
    try {
      removeProduct(product.id)
      setNotice('Producto eliminado correctamente.')
      if (editingId === product.id) resetForm()
    } catch (caughtError) {
      setError(caughtError.message)
    }
  }

  return (
    <section className="container content-section admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">GESTIÓN DE LA TIENDA</span>
          <h1>Panel de administración</h1>
          <p>Administra el catálogo de productos de Descanso Total.</p>
        </div>
        <div className="admin-stat"><strong>{products.length}</strong><span>productos activos</span></div>
      </div>

      <div className="admin-layout">
        <form className="admin-form" onSubmit={submitProduct}>
          <h2>{editingId ? 'Editar producto' : 'Agregar producto'}</h2>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {notice && <div className="alert alert-success" role="status">{notice}</div>}
          <label className="form-label" htmlFor="product-name">Nombre</label>
          <input className="form-control" id="product-name" name="name" value={form.name} onChange={updateField} required />
          <label className="form-label" htmlFor="product-category">Categoría</label>
          <select className="form-select" id="product-category" name="category" value={form.category} onChange={updateField}>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label" htmlFor="product-price">Precio normal</label>
              <input className="form-control" id="product-price" name="price" type="number" min="1" value={form.price} onChange={updateField} required />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="product-offer">Precio oferta</label>
              <input className="form-control" id="product-offer" name="offerPrice" type="number" min="1" value={form.offerPrice} onChange={updateField} />
            </div>
          </div>
          <label className="form-label" htmlFor="product-stock">Stock</label>
          <input className="form-control" id="product-stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={updateField} required />
          <label className="form-label" htmlFor="product-image">URL de imagen</label>
          <input className="form-control" id="product-image" name="image" type="url" value={form.image} onChange={updateField} required />
          <label className="form-label" htmlFor="product-description">Descripción</label>
          <textarea className="form-control" id="product-description" name="description" rows="3" value={form.description} onChange={updateField} required />
          <div className="form-actions">
            <button className="btn btn-dark" type="submit">{editingId ? 'Guardar cambios' : 'Crear producto'}</button>
            {editingId && <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Cancelar</button>}
          </div>
        </form>

        <div className="admin-catalog">
          <h2>Catálogo de productos</h2>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Producto</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td><div className="admin-product-name"><img src={product.image} alt="" /><span>{product.name}<small>{product.category}</small></span></div></td>
                    <td>{formatPrice(product.offerPrice || product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-sm btn-outline-dark" type="button" onClick={() => startEditing(product)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => deleteSelectedProduct(product)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
