import React from 'react'
import MainRouter from './MainRouter'
import Header from './components/NavBar/Header'
import Footer from './components/NavBar/Footer'
import { AuthenticatedProvider } from './context/AuthenticatedUser'
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider } from './context/Theme'

const App = () => {
  return (
    <div className='font-poppins'>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider>
          <AuthenticatedProvider>
            <Header />
            <MainRouter />
            <Footer />
          </AuthenticatedProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </div>
  )
}

export default App