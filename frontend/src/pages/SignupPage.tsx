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
import { setToken, signup } from '@/lib/auth'
import { describeApiError } from '@/lib/messages'

export default function SignupPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Introduce tu email y tu contraseña.')
      return
    }

    // Mismas reglas que `signupValidator` en el backend (8–32), validadas
    // también aquí para dar feedback inmediato sin ida y vuelta al API.
    if (password.length < 8 || password.length > 32) {
      setError('La contraseña debe tener entre 8 y 32 caracteres.')
      return
    }

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    try {
      const trimmedName = fullName.trim()
      const { token } = await signup({
        fullName: trimmedName === '' ? null : trimmedName,
        email: email.trim(),
        password,
        passwordConfirmation,
      })
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
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>
            Regístrate para empezar a usar FlowSync.
          </CardDescription>
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
              <Label htmlFor="fullName">Nombre completo (opcional)</Label>
              <Input
                id="fullName"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Entre 8 y 32 caracteres.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="passwordConfirmation">Repite la contraseña</Label>
              <Input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link className="underline underline-offset-4" to="/login">
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
