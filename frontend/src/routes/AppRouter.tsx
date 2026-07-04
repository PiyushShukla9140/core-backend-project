import React from 'react'

import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.tsx'
import AuthLayout from '../layouts/AuthLayout.tsx'

import Dashboard from '../pages/Dashboard.tsx'
import Home from '../pages/Home.tsx'
import Login from '../pages/Login.tsx'
import NotFound from '../pages/NotFound.tsx'
import SignUp from '../pages/Signup.tsx'
import Watch from '../pages/Watch.tsx'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "watch/:videoId",
                element: <Watch />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
        ],
    },
    {
        element:<AuthLayout/>,
        children:[
            {
                path:"/login",
                element:<Login/>
            },
            {
                path: "/signup",
                element: <SignUp />,
            }
        ]
    },
    { 
        path: "*",
        element: <NotFound />,
    },
    
])

