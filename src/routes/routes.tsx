import { createBrowserRouter, RouterProvider } from "react-router-dom"
import SignUp from "../pages/SignUp";
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
