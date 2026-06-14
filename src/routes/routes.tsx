import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import Layout from '../Layout';
import Forgetpassword from '../pages/Forgetpassword';
import { ToastContainer } from 'react-toastify';
import Resetpassword from '../pages/Resetpassword';
import Guard from '../Componenets/Guard/Guard';
import ProjectLayout from '../pages/ProjectLayout';
import ProjectsPage from '../pages/ProjectsPage';
import AddProject from '../pages/AddProject';
import AddNewEpic from '../pages/AddNewEpic';
import EditPage from '../pages/EditPage';
import Members from '../pages/Members';
import EpicsPage from '../pages/EpicsPage';

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
            <ProjectLayout/>
          </Guard>
        ),
        children: [
          {
            index: true,
            element: <ProjectsPage />,
          },
          {
            path: 'add',
            element: <AddProject />,
          },
          {
            path: ':projectId/epics/create',
            element: <AddNewEpic />,
          },
          {
            path: ':projectId/edit',
            element: <EditPage />,
          },
          {
            path: ':projectId/members',
            element: <Members />,
          },
          {
            path: ':projectId/epics/new',
            element: <EpicsPage />,
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
