import { createBrowserRouter, RouterProvider } from "react-router-dom"
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Layout from "../Layout";
import { ToastContainer } from 'react-toastify';

export default function routes() {
   const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
    //   {
    //     index: true,
    //     element: <Home />,
    //   },
      {
        path:'signUp',
        element: <SignUp/>,
      },
      {
        path:'login',
        element: <Login/>,
      },
     
    ],
  },
]);
  return (
    <>
      <ToastContainer/>
  <RouterProvider router={router}/>
    </>
  
  )
}
