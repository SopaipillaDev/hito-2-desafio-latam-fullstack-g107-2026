// Formulario para crear una publicación (POST /products). Si se indica una URL de
// portada, después se guarda como imagen de portada (POST /products/:id/images).
// Solo lo ve el rol admin (AdminRoute).
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { addProductImage, createProduct } from '../../services/productService'
import { useCategories } from '../../hooks/useCategories'

const INITIAL_VALUES = {
  name: '',
  slug: '',
  category_id: '',
  price: '',
  description: '',
  cover_url: '',
}

// Reglas que pide el backend: nombre, slug, categoría y precio entero mayor a 0.
const schema = yup.object({
  name: yup.string().trim().required('El nombre es obligatorio'),
  slug: yup
    .string()
    .required('El slug es obligatorio')
    .matches(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  category_id: yup.string().required('Selecciona una categoría'),
  price: yup
    .number()
    .typeError('El precio debe ser un número')
    .integer('El precio debe ser un número entero')
    .positive('El precio debe ser mayor a 0')
    .required('El precio es obligatorio'),
  cover_url: yup
    .string()
    .test('url', 'Ingresa una URL que empiece con http:// o https://', (value) =>
      !value || /^https?:\/\/.+/.test(value),
    ),
})

// Convierte el nombre en slug: quita tildes, pasa a minúsculas y reemplaza
// los caracteres no válidos por guiones. Ej: "Árbol de Ñandú" → "arbol-de-nandu".
function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function NuevoProducto() {
  const navigate = useNavigate()
  const { categories } = useCategories()

  const [values, setValues] = useState(INITIAL_VALUES)
  // Si el admin edita el slug a mano, deja de generarse desde el nombre.
  const [slugEdited, setSlugEdited] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    if (name === 'slug') setSlugEdited(true)

    setValues((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'name' && !slugEdited) next.slug = slugify(value)
      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')

    // Valida con yup y reparte cada mensaje al campo correspondiente.
    try {
      await schema.validate(values, { abortEarly: false })
      setErrors({})
    } catch (validationError) {
      const porCampo = {}
      validationError.inner.forEach((err) => {
        porCampo[err.path] = err.message
      })
      setErrors(porCampo)
      return
    }

    setSaving(true)
    try {
      const product = await createProduct({
        name: values.name.trim(),
        slug: values.slug,
        description: values.description.trim() || undefined,
        price: Number(values.price),
        category_id: Number(values.category_id),
      })

      if (values.cover_url.trim()) {
        await addProductImage(product.id, {
          url: values.cover_url.trim(),
          alt_text: values.name.trim(),
          is_cover: true,
          position: 1,
        })
      }

      navigate('/admin/productos')
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'No se pudo crear el producto.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <h1 className="h3 mb-4">Nuevo producto</h1>

            {apiError && (
              <div className="alert alert-danger py-2" role="alert">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Nombre *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={values.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-12 col-md-4">
                  <label htmlFor="price" className="form-label fw-semibold">
                    Precio (CLP) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    value={values.price}
                    onChange={handleChange}
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="slug" className="form-label fw-semibold">
                    Slug *
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                    value={values.slug}
                    onChange={handleChange}
                  />
                  {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="category_id" className="form-label fw-semibold">
                    Categoría *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                    value={values.category_id}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <div className="invalid-feedback">{errors.category_id}</div>
                  )}
                </div>

                <div className="col-12">
                  <label htmlFor="description" className="form-label fw-semibold">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="form-control"
                    value={values.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="cover_url" className="form-label fw-semibold">
                    URL de la portada
                  </label>
                  <input
                    id="cover_url"
                    name="cover_url"
                    type="url"
                    placeholder="https://..."
                    className={`form-control ${errors.cover_url ? 'is-invalid' : ''}`}
                    value={values.cover_url}
                    onChange={handleChange}
                  />
                  {errors.cover_url && (
                    <div className="invalid-feedback">{errors.cover_url}</div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link to="/admin/productos" className="btn btn-outline-secondary">
                  Cancelar
                </Link>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Crear producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NuevoProducto
