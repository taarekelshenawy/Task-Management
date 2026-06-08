import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import Layout from '../Layout';
import Forgetpassword from '../pages/Forgetpassword';
import { ToastContainer } from 'react-toastify';
import Dashboard from '../pages/Dashboard';
import Resetpassword from '../pages/Resetpassword';
import Guard from '../Componenets/Guard/Guard';

export default function routes() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <Guard>
              <Dashboard />
            </Guard>
       
          ),
        },
        {
          path: 'sign-up',
          element: <SignUp />,
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'forgot-password',
          element: <Forgetpassword />,
        },
        {
          path: 'reset-password',
          element: <Resetpassword />,
        },
      ],
    },
  ]);
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}
