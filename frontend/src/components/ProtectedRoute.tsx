import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import PageContainer from '@/components/PageContainer'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiError } from '@/lib/api'
import { clearToken, fetchProfile, getToken, type User } from '@/lib/auth'
import { describeApiError } from '@/lib/messages'

export type ProtectedContext = { user: User }

type State =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'ready'; user: User }
  | { status: 'error'; message: string }

export default function ProtectedRoute() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Sin token no tiene sentido llamar al API: redirigimos a login.
    if (!getToken()) {
      setState({ status: 'unauthenticated' })
      return
    }

    let active = true
    setState({ status: 'loading' })

    fetchProfile()
      .then((user) => {
        if (active) setState({ status: 'ready', user })
      })
      .catch((error: unknown) => {
        if (!active) return

        // Token caducado o revocado: limpiamos y volvemos a login.
        if (error instanceof ApiError && error.status === 401) {
          clearToken()
          setState({ status: 'unauthenticated' })
          return
        }

        setState({ status: 'error', message: describeApiError(error) })
      })

    return () => {
      active = false
    }
  }, [attempt])

  if (state.status === 'unauthenticated')
    return <Navigate to="/login" replace />

  if (state.status === 'loading') {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Cargando tu perfil…</p>
      </PageContainer>
    )
  }

  if (state.status === 'error') {
    return (
      <PageContainer>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>No se pudo cargar el perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
            <Button onClick={() => setAttempt((current) => current + 1)}>
              Volver a intentar
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return <Outlet context={{ user: state.user } satisfies ProtectedContext} />
}
