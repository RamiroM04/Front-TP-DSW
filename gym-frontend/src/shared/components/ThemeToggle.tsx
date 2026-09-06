import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/app/providers/ThemeProvider'
import { Button } from '@/shared/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : theme === "dark"
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}