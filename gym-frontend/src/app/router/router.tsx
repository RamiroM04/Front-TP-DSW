import { createBrowserRouter } from 'react-router-dom'
import NotFoundPage from '../../pages/public/NotFoundPage'
import LoginPage from '../../pages/auth/LoginPage'
import RoleLayout from '../../layouts/RoleLayout'
import TemporalLanding from '../../pages/TemporaryLandingPage'
import AdminClassesPage from '../../pages/admin/ClassesPage'
import MembersPage from '../../pages/admin/MembersPage'
import NewMemberPage from '../../pages/admin/members/NewMemberPage'
import EditMemberPage from '@/pages/admin/members/EditMemberPage'
import MemberDetailsPage from '@/pages/admin/members/MemberDetailsPage'
import MembershipPlansPage from '../../pages/admin/MembershipPlansPage'
import ClassScheduleFormPage from '../../pages/admin/classes/EditClassPage'
import RutinasPage from '../../pages/instructor/RutinasPage'
import EjerciciosPage from '../../pages/instructor/EjerciciosPage'
import MemberClassesPage from '../../pages/member/ClassesPage'


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
      { path: 'clases/nueva', element: <ClassScheduleFormPage /> },
      { path: 'clases/:id/editar', element: <ClassScheduleFormPage /> },
      { path: 'socios', element: <MembersPage /> },
      { path: 'socios/nuevo', element: <NewMemberPage /> },
      { path: 'socios/editar/:id', element: <EditMemberPage /> },
      { path: 'socios/:id', element: <MemberDetailsPage /> },
      { path: 'planes', element: <MembershipPlansPage /> },
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