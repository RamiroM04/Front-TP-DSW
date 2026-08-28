import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import { TooltipProvider } from '@/shared/components/ui/tooltip'

export default function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}