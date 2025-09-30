import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout