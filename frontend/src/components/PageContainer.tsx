import type { ReactNode } from 'react'

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      {children}
    </main>
  )
}
