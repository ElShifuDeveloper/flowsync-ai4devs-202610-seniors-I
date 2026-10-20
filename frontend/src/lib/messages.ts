import { ApiError } from '@/lib/api'

const GENERIC_ERROR = 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'

/**
 * Traduce los errores del backend a mensajes de usuario en español.
 *
 * Contrato real del API (verificado contra el backend):
 * - 400 + `E_INVALID_CREDENTIALS` → credenciales de login incorrectas.
 * - 401 → token ausente, inválido o revocado.
 * - 422 → validación de VineJS, con `field` y `rule`.
 */
export function describeApiError(error: unknown): string {
  if (!(error instanceof ApiError)) return GENERIC_ERROR

  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Comprueba que el backend esté en marcha.'
  }

  if (error.status === 401) {
    return 'Tu sesión ha caducado. Vuelve a iniciar sesión.'
  }

  if (error.status === 400) {
    return 'Email o contraseña incorrectos.'
  }

  if (error.status === 422) {
    const { field, rule, message } = error.errors[0] ?? {}

    if (field === 'email') {
      return rule === 'database.unique'
        ? 'Ese email ya está registrado. Prueba a iniciar sesión.'
        : 'Introduce un email válido.'
    }
    if (field === 'password')
      return 'La contraseña debe tener entre 8 y 32 caracteres.'
    if (field === 'passwordConfirmation') return 'Las contraseñas no coinciden.'
    if (field === 'fullName') return 'El nombre completo no es válido.'

    return message || 'Revisa los datos del formulario.'
  }

  return error.errors[0]?.message || GENERIC_ERROR
}
