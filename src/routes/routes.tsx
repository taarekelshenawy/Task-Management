import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from '../pages/auth/SignUp';
import Login from '../pages/auth/Login';
import Forgetpassword from '../pages/auth/Forgetpassword';
import { ToastContainer } from 'react-toastify';
import Resetpassword from '../pages/auth/Resetpassword';
import ProjectsPage from '../pages/project/ProjectsPage';
import AddProject from '../pages/project/AddProject';
import AddNewEpic from '../pages/project/AddNewEpic';
import EditPage from '../pages/project/EditPage';
import Members from '../pages/project/Members';
import EpicsPage from '../pages/project/EpicsPage';
import ProjectLayout from '../layouts/ProjectLayout';
import ProtectedRoute from './ProtectedRoute';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // =====================
  // AUTH ROUTES
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/sign-up', element: <SignUp /> },
      { path: '/forgot-password', element: <Forgetpassword /> },
      { path: '/reset-password', element: <Resetpassword /> },
    ],
  },

  {
    path: '/project',
    element: (
      <ProtectedRoute>
        <ProjectLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ProjectsPage /> },

      // project actions
      { path: 'add', element: <AddProject /> },
      { path: ':projectId/edit', element: <EditPage /> },
      { path: ':projectId/members', element: <Members /> },
      { path: ':projectId/epics', element: <EpicsPage /> },
      { path: ':projectId/epics/create', element: <AddNewEpic /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default function Routes() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}
