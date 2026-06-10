import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import Layout from '../Layout';
import Forgetpassword from '../pages/Forgetpassword';
import { ToastContainer } from 'react-toastify';
import Dashboard from '../pages/Dashboard';
import Resetpassword from '../pages/Resetpassword';
import Guard from '../Componenets/Guard/Guard';
import AddProject from '../Componenets/AddProject/AddProject';
import Projects from '../Componenets/Projects/Projects';
import Epics from '../Componenets/Epics/Epics';
import ProjectLayout from '../pages/ProjectLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'sign-up',
        element: <SignUp />,
      },
      {
        path: 'forgot-password',
        element: <Forgetpassword />,
      },
      {
        path: 'reset-password',
        element: <Resetpassword />,
      },
      {
        path: 'project',
        element: (
          <Guard>
            <Dashboard />
          </Guard>
        ),
        children: [
          {
            index: true,
            element: <Projects />,
          },
          {
            path: 'add',
            element: <AddProject />,
          },
        ],
      },
      {
        path: 'project/:projectId',
        element: (
          <Guard>
            <ProjectLayout />
          </Guard>
        ),
        children: [
          {
            path: 'tasks',
            element: <div>Tasks Page</div>,
          },
          {
            path: 'epics',
            element: <Epics />,
          },
          {
            path: 'members',
            element: <div>Members Page</div>,
          },
          {
            path: 'edit',
            element: <div>Edit Project</div>,
          },
        ],
      },
    ],
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
