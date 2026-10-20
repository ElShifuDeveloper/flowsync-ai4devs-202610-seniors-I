import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageContainer from '@/components/PageContainer'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, setToken } from '@/lib/auth'
import { describeApiError } from '@/lib/messages'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Introduce tu email y tu contraseña.')
      return
    }

    setSubmitting(true)
    try {
      // El login no impone longitud mínima de contraseña (solo el signup),
      // así que aquí no validamos ese límite.
      const { token } = await login({ email: email.trim(), password })
      setToken(token)
      navigate('/profile', { replace: true })
    } catch (caught) {
      setError(describeApiError(caught))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageContainer>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Accede con tu cuenta de FlowSync.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link className="underline underline-offset-4" to="/signup">
              Regístrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
