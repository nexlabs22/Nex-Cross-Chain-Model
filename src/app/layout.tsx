import { useLandingPageStore } from '@/store/store';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme, setTheme } = useLandingPageStore()
  return (
    <html lang="en">

      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
