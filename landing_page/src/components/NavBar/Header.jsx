import React from 'react'

const Header = () => {
  return (
    <header className="bg-black text-white flex items-center px-6 py-4 justify-around fixed w-full z-50">
        <div className="flex gap-2 items-center">
          <img src="./logo.png" className='w-14' alt="" />
        </div>
     
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-gray-300">Transport</a>
          <a href="#" className="hover:text-gray-300">Provide</a>
          <a href="#" className="hover:text-gray-300">About</a>
          <a href="#" className="hover:text-gray-300">Help</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="text-white px-4 py-2 rounded-full font-medium">
            Sign in
          </button>
          <button className="bg-white text-black px-4 py-2 rounded-full font-medium">
            Sign Up
          </button>
          <button className="md:hidden">☰</button>
        </div>
      </header>
  )
}

export default Header