// Vista pública para registrar a un usuario.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { register } from '../../services/authService'

// Reglas para crear un usuario nuevo con nombre, correo y una contraseña que tenga al menos 8 caracteres.
const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio').min(4, "Mínimo 4 letras"),
  email: yup.string().required('El correo es obligatorio').email("Ingresa un correo válido"),
  password: yup.string().required('La contraseña es obligatoria').min(8, 'Mínimo 8 caracteres'),
  confirmPassword: yup
    .string()
    .required('Repite la contraseña')
    .oneOf([yup.ref("password")], 'Las contraseñas no coinciden'),
})

function RegistroUsuarios() {
  const navigate = useNavigate()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')

    // Valida el formulario con yup: si pasa, limpia los errores; si falla,
    // reparte cada mensaje al campo correspondiente y corta el envío.
    try {
      await schema.validate({ name, email, password, confirmPassword }, { abortEarly: false })
      setNameError('')
      setEmailError('')
      setPasswordError('')
      setConfirmPasswordError('')
    } catch (validationError) {
      const erroresPorCampo = {}
      validationError.inner.forEach((err) => {
        erroresPorCampo[err.path] = err.message
      })
      setNameError(erroresPorCampo.name ?? '')      
      setEmailError(erroresPorCampo.email ?? '')
      setPasswordError(erroresPorCampo.password ?? '')
      setConfirmPasswordError(erroresPorCampo.confirmPassword ?? '')
      return
    }

    // Llama a la API. Si falla (p. ej. 401 credenciales inválidas), muestra el
    // mensaje del backend o uno genérico.
    try {
      setLoading(true)
      await register({ name, email, password })
      navigate('/login', { replace: true })

    } catch (error) {
      setApiError(
        error.response?.data?.message ?? 'No se pudo crear la cuenta.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <h1 className="h3 text-center mb-2">Crear Cuenta</h1>
            <p className="text-body-secondary text-center mb-4">
              Registra una cuenta de usuario
            </p>

            {apiError && (
              <div className="alert alert-danger py-2" role="alert">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  Nombre *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-control ${nameError ? 'is-invalid' : ''}`}
                  placeholder="Juanito Perez"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                />
                {nameError && (
                  <div className="invalid-feedback">{nameError}</div>
                )}
              </div>

                            <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Correo *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${emailError ? 'is-invalid' : ''}`}
                  placeholder="juan@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
                {emailError && (
                  <div className="invalid-feedback">{emailError}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  Contraseña *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                  placeholder="******"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                />
                {passwordError && (
                  <div className="invalid-feedback">{passwordError}</div>
                )}
              </div>
              
               <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">
                  Confirmar Contraseña *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />
                {confirmPasswordError && (
                  <div className="invalid-feedback">{confirmPasswordError}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 py-2"
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            <p className="text-center mt-4 mb-0">
              ¿Ya tienes cuenta? <Link to="/login">Acceder a tu cuenta</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistroUsuarios
