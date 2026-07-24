import React from 'react'

import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/navbar'
import Sidebar from '@/components/layout/sideBar'

import { SidebarProvider } from '@/contexts/sideBarContext'

function MainLayout() {
  return (
    <>
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          <Navbar />

          <div className="flex">
            <Sidebar />

            <main className="flex-1 p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  )
}

export default MainLayout