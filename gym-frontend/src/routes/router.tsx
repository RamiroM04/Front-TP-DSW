import { createBrowserRouter } from 'react-router-dom'
import NotFoundPage from '../pages/NotFoundPage'
import LoginPage from '../pages/LoginPage'
import RoleLayout from '../layouts/RoleLayout'
import TemporalLanding from '../pages/TemporaryLandingPage'
import AdminClassesPage from '../pages/admin/ClassesPage'
import MembersPage from '../pages/admin/MembersPage'
import NewMemberPage from '../pages/admin/NewMemberPage'
import RutinasPage from '../pages/instructor/RutinasPage'
import EjerciciosPage from '../pages/instructor/EjerciciosPage'
import MemberClassesPage from '../pages/member/ClassesPage'
import PlanesPage from '../pages/admin/PlanesPage'

//TODO: Implementar lazy loading para las páginas de cada rol, para que no se carguen todas al inicio y solo se carguen cuando el usuario accede a la ruta correspondiente.

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/project-overview',
    element: <TemporalLanding />,
  },
  {
    path: '/administrativo',
    element: <RoleLayout role="admin" />,
    children: [
      { path: 'clases', element: <AdminClassesPage /> },
      { path: 'socios', element: <MembersPage /> },
      { path: 'socios/nuevo', element: <NewMemberPage /> },
      { path: 'socios/editar/:id', element: <NewMemberPage /> },
      { path: 'planes', element: <PlanesPage /> },
    ],
  },
  {
    path: '/instructor',
    element: <RoleLayout role="instructor" />,
    children: [
      { index: true, element: <div className="p-4 text-2xl font-bold">Inicio Instructor</div> },
      { path: 'rutinas', element: <RutinasPage /> },
      { path: 'ejercicios', element: <EjerciciosPage /> },
    ],
  },
  {
    path: '/socio',
    element: <RoleLayout role="member" />,
    children: [
      { index: true, element: <div className="p-4 text-2xl font-bold">Inicio Socio</div> },
      { path: 'rutinas', element: <RutinasPage /> },
      { path: 'clases', element: <MemberClassesPage /> }
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])