const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

/**
 * Forma de un error devuelto por el backend.
 * - Errores de validación (VineJS, 422): incluyen `rule` y `field`.
 * - Errores de dominio (p. ej. `E_INVALID_CREDENTIALS`, 400) y de auth (401):
 *   solo incluyen `message`.
 */
export type ApiErrorItem = {
  message?: string
  rule?: string
  field?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly errors: ApiErrorItem[]

  constructor(status: number, errors: ApiErrorItem[]) {
    super(errors[0]?.message ?? `Error ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string | null
}

function extractErrors(payload: unknown, status: number): ApiErrorItem[] {
  const raw = (payload as { errors?: unknown } | null)?.errors

  if (Array.isArray(raw) && raw.length > 0) {
    return raw.filter(
      (item): item is ApiErrorItem => typeof item === 'object' && item !== null,
    )
  }

  return [{ message: `Error inesperado del servidor (${status}).` }]
}

/**
 * El backend responde con el payload envuelto en `{ data: ... }`
 * (transformers de AdonisJS), pero los errores llegan con `errors` en la raíz.
 */
function unwrap(payload: unknown): unknown {
  if (payload !== null && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: unknown }).data
  }
  return payload
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    // status 0 = no se pudo hablar con el servidor (backend apagado, red, CORS).
    throw new ApiError(0, [{ message: 'No se pudo conectar con el servidor.' }])
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, extractErrors(payload, response.status))
  }

  return unwrap(payload) as T
}
