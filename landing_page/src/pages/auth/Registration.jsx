import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import VerificationModal from '../../components/modal/VerificationCode';
import { API } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

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

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      const payload = {
        full_name: formData.name, email: formData.email, password: formData.password, phone_number: formData.phone,
      }

      try {
        const response = await API.createUserAccount(payload);
        console.log(response.data)
        if(response.data){
                setTimeout(() => {
        setIsSubmitting(false);
        setShowVerification(true)
      }, 1500);
        }
      } catch (error) {
        console.log(error)
        alert('Something went wrong')
          setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleVerifyAccount = async (code) => {
    try {
      const response = await API.verifyAccount({email: formData.email, code})
      if(response.data){
        navigate('/login')
        alert("Successfully Created")
      }
    } catch (error) {
      console.log(error)
      alert("Invalid Code or Expired")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <img src="./logo.png" className="w-12 h-12 mr-3" alt="Transive" />
              <h2 className="text-2xl font-bold">Create Account</h2>
            </div>
          </div>


          <VerificationModal isOpen={showVerification} onClose={()=> setShowVerification(false)} email={formData.email} onVerify={handleVerifyAccount}/>
          
          <form onSubmit={handleSubmit} className="space-y-6">
         
            <div className="flex gap-3 items-center">
                   <div className='w-full'>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className='w-full'>
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
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="+1 234 567 8900"
                />
              </div>
              {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone}</p>}
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
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`bg-gray-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg block w-full pl-10 pr-10 p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 bg-gray-800 border-gray-600 rounded focus:ring-blue-600 focus:ring-2"
                  required
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm font-medium">
                I agree to the <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a>
              </label>
            </div>
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-white text-black font-medium rounded-lg px-5 py-2.5 text-center hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </motion.button>
            
            <div className="text-sm font-medium text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                className="text-blue-500 hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration