// Vista pública de inicio de sesión. Valida el formulario con yup y, si es
// válido, autentica contra la API (authService.login). Con la respuesta
// { token, user } guarda el token (localStorage y contexto), setea el usuario y
// redirige según el rol: admin → /admin, resto → /perfil.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import {
  login as loginRequest,
  setToken as saveToken,
} from '../../services/authService'
import { useUser } from '../../context/UserContext'

// Reglas de validación del formulario: email obligatorio y con formato válido,
// contraseña obligatoria. Los textos son los que se muestran bajo cada campo.
const schema = yup.object({
  email: yup
    .string()
    .required('El email es obligatorio')
    .email('Ingresa un email válido'),
  password: yup.string().required('La contraseña es obligatoria'),
})

function Login() {
  const navigate = useNavigate()
  const { setToken, setUser } = useUser()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError('')

    // Valida el formulario con yup: si pasa, limpia los errores; si falla,
    // reparte cada mensaje al campo correspondiente y corta el envío.
    try {
      await schema.validate({ email, password }, { abortEarly: false })
      setEmailError('')
      setPasswordError('')
    } catch (validationError) {
      const erroresPorCampo = {}
      validationError.inner.forEach((err) => {
        erroresPorCampo[err.path] = err.message
      })
      setEmailError(erroresPorCampo.email ?? '')
      setPasswordError(erroresPorCampo.password ?? '')
      return
    }

    // Llama a la API. Si falla (p. ej. 401 credenciales inválidas), muestra el
    // mensaje del backend o uno genérico.
    try {
      setLoading(true)
      const data = await loginRequest(email, password)

      saveToken(data.token) // localStorage (para próximas cargas)
      setToken(data.token) // estado del contexto
      setUser(data.user)

      navigate(data.user.role === 'admin' ? '/admin' : '/perfil', {
        replace: true,
      })
    } catch (error) {
      setApiError(
        error.response?.data?.message ?? 'Email o contraseña incorrectos.',
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
            <h1 className="h3 text-center mb-2">Iniciar sesión</h1>
            <p className="text-muted text-center mb-4">
              Ingresa con tu email y contraseña
            </p>

            {apiError && (
              <div className="alert alert-danger py-2" role="alert">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email *
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
                  autoComplete="current-password"
                />
                {passwordError && (
                  <div className="invalid-feedback">{passwordError}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 py-2"
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="text-center mt-4 mb-0">
              ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
