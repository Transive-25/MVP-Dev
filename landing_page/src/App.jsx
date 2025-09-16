import React from 'react'
import MainRouter from './MainRouter'
import Header from './components/NavBar/Header'
import Footer from './components/NavBar/Footer'

const App = () => {
  return (
    <div className='font-poppins'>
      <Header/>
      <MainRouter/>
      <Footer/>
    </div>
  )
}

export default App