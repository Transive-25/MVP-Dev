import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API } from '../../api/api';
import { saveToken } from '../../helper/tokenHandler';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await API.loginUserAccount({email: formData.email, password: formData.password})
        console.log(response.data)
        location.href = '/dashboard/mainboard'
        saveToken(response.data.accessToken)
      } catch (error) {
        console.log(error);
        if(error.message === "User not found"){
          setErrors({email: "User not found"})
        } else {
          setErrors({password: "Invalid Password"})
        }
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <img src="./logo.png" className="w-12 h-12 mr-3" alt="Transive" />
              <h2 className="text-2xl font-bold">Sign In</h2>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg block w-full pl-10 pr-10 p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 bg-gray-800 border-gray-600 rounded focus:ring-blue-600 focus:ring-2"
                  />
                </div>
                <label htmlFor="remember" className="ml-2 text-sm font-medium">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-white text-black font-medium rounded-lg px-5 py-2.5 text-center hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </motion.button>
            
            <div className="text-sm font-medium text-gray-400">
              Not registered?{' '}
              <button
                type="button"
                className="text-blue-500 hover:underline"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login