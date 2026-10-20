import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import PageContainer from '@/components/PageContainer'
import type { ProtectedContext } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { clearToken, logout } from '@/lib/auth'

function formatMemberSince(value: string): string {
  return new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(
    new Date(value),
  )
}

export default function ProfilePage() {
  const { user } = useOutletContext<ProtectedContext>()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  async function handleLogout() {
    setSubmitting(true)
    try {
      await logout()
    } catch {
      // El logout local ocurre igual: si el token ya no es válido no tiene
      // sentido dejar al usuario atrapado en la vista protegida.
    } finally {
      clearToken()
      navigate('/login', { replace: true })
    }
  }

  return (
    <PageContainer>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Tu perfil</CardTitle>
          <CardDescription>
            Estos datos vienen de <code>GET /api/v1/account/profile</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground"
            >
              {user.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">
                {user.fullName ?? 'Sin nombre'}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <dl className="flex flex-col gap-1 text-sm">
            <dt className="text-muted-foreground">Miembro desde</dt>
            <dd>{formatMemberSince(user.createdAt)}</dd>
          </dl>

          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={submitting}
          >
            {submitting ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
