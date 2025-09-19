import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthenticatedUser";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/Theme";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, handleLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-black dark:bg-gray-900 text-white flex items-center px-6 py-4 justify-around w-full z-50">
      <div
        onClick={() => navigate("/")}
        className="flex hover:cursor-pointer gap-2 items-center"
      >
        <img src="/logo.png" className="w-16 h-16 mr-3" alt="Transive" />
      </div>

      <nav className="hidden md:flex space-x-6">
        <a href="#" className="hover:text-gray-300">
          Transport
        </a>
        <a href="#" className="hover:text-gray-300">
          Provide
        </a>
        <a href="#" className="hover:text-gray-300">
          About
        </a>
        <a href="#" className="hover:text-gray-300">
          Help
        </a>
      </nav>

      <div className="flex items-center space-x-4">
        {/* 👇 Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {theme === "dark" ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-white" />
          )}
        </button>

        {currentUser ? (
          <button
            onClick={handleLogout}
            className="text-white hover:cursor-pointer px-4 py-2 rounded-full font-medium"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-white hover:cursor-pointer px-4 py-2 rounded-full font-medium"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white hover:cursor-pointer text-black px-4 py-2 rounded-full font-medium"
            >
              Sign Up
            </button>
            <button className="md:hidden">☰</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
