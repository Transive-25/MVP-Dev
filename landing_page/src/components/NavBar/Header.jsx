import React from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthenticatedUser';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, handleLogout } = useAuth();

  return (
    <header className="bg-black text-white flex items-center px-6 py-4 justify-around fixed w-full z-50">
        <div  onClick={() => navigate("/")} className="flex hover:cursor-pointer gap-2 items-center">
          <img src="/logo.png" className="w-12 h-12 mr-3" alt="Transive" />
        </div>
     
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-gray-300">Transport</a>
          <a href="#" className="hover:text-gray-300">Provide</a>
          <a href="#" className="hover:text-gray-300">About</a>
          <a href="#" className="hover:text-gray-300">Help</a>
        </nav>
        {currentUser ?  <div className="flex items-center space-x-4">
          <button    onClick={() => handleLogout()} className="text-white hover:cursor-pointer px-4 py-2 rounded-full font-medium">
            Logout
          </button>
        </div> :  <div className="flex items-center space-x-4">
          <button    onClick={() => navigate("/login")} className="text-white hover:cursor-pointer px-4 py-2 rounded-full font-medium">
            Sign in
          </button>
          <button    onClick={() => navigate("/register")} className="bg-white hover:cursor-pointer text-black px-4 py-2 rounded-full font-medium">
            Sign Up
          </button>
          <button className="md:hidden">☰</button>
        </div>}
      </header>
  )
}

export default Header