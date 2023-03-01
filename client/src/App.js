import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom';

/**Import all components */
import Username from './components/Username';
import Password from './components/Password';
import Profile from './components/Profile';
import Register from './components/Register';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
import { Authrizeuser,ProtectRoute } from './middleware/auth';


/**Root Route */
const router= createBrowserRouter([
    {
        path:'/',
        element:<Username></Username>
    },
    {
        path:'/register',
        element:<Register/>
    },
    {
        path:'/password',
        element:<ProtectRoute><Password/></ProtectRoute>
    },
    {
        path:'/profile',
        element:<Authrizeuser><Profile/></Authrizeuser>
    },
    {
        path:'/pagenotfound',
        element:<PageNotFound/>
    },
    {
        path:'/recovery',
        element:<Recovery/>
    },
    {
        path:'/reset',
        element:<Reset/>
    },

])

export default function App() {
  return (
     <main>
            <RouterProvider router={router}></RouterProvider>
    </main>
   
  )
}
