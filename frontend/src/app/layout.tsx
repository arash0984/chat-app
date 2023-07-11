import { AuthProvider } from 'lib/context/Auth'
import { GlobalCss, ResetCss, StyledComponentsRegistry } from 'lib/style'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <StyledComponentsRegistry>
        <ResetCss />
        <GlobalCss />
        <AuthProvider>
          <body>{children}</body>
        </AuthProvider>
      </StyledComponentsRegistry>
    </html>
  )
}
