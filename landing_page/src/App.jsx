import React from 'react'
import MainRouter from './MainRouter'
import Header from './components/NavBar/Header'
import Footer from './components/NavBar/Footer'
import { AuthenticatedProvider } from './context/AuthenticatedUser'

const App = () => {
  return (
    <div className='font-poppins'>
      <AuthenticatedProvider>
        <Header />
        <MainRouter />
        <Footer />
      </AuthenticatedProvider>
    </div>
  )
}

export default App