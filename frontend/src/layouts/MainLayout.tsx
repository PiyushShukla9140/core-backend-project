import React from 'react'

import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <>
        <h2>Navbar</h2>
        <Outlet/>
       
    </>
  )
}

export default MainLayout