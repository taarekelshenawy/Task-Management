import { createBrowserRouter, RouterProvider } from "react-router-dom"
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Layout from "../Layout";
import Forgetpassword from "../pages/Forgetpassword";
import { ToastContainer } from 'react-toastify';
import Dashboard from "../pages/Dashboard";
import Guard from "../Componenets/Guard/Guard";


export default function routes() {
   const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        index: true,
        element: 
        <Guard>
         <Dashboard/>
        </Guard>
      
        ,
      },
      {
        path:'signUp',
        element: <SignUp/>,
      },
      {
        path:'login',
        element: <Login/>,
      },
       {
        path:'forgot-password',
        element: <Forgetpassword/>,
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
