
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API } from '../../api/api';

const VerificationModal = ({ isOpen, onClose, email, onVerify }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus to next input
    if (value && index < 5) {
      document.getElementById(`verification-input-${index + 1}`).focus();
    }
    
    // If all fields are filled, automatically verify
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerify();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Move to previous input on backspace
      document.getElementById(`verification-input-${index - 1}`).focus();
    }
  };

  const handleVerify = () => {
    const code = verificationCode.join('');
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    // Simulate API call to resend code
    try {
        const response = await API.resendVerificationCode({email})
        if(response.data){
                setTimeout(() => {
      setIsResending(false);
      setCountdown(30); // 30 seconds countdown
      alert('Verification code sent!');
    }, 1000);
        }
    } catch (error) {
        console.log(error)
    } finally {
        setIsResending(false)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Verify Your Email</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>
          
          <p className="text-gray-400 mb-6">
            We've sent a verification code to <span className="text-white">{email}</span>. 
            Please enter the code below to complete your registration.
          </p>
          
          <div className="flex justify-center items-center mb-5 gap-2">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`verification-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 bg-transparent border border-gray-700 rounded-lg text-white text-center text-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleVerify}
              className="w-full bg-white text-black font-medium rounded-lg px-5 py-2.5 text-center hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-800"
            >
              Verify Account
            </button>
            
            <div className="text-center">
              <button
                onClick={handleResendCode}
                disabled={isResending || countdown > 0}
                className={`text-blue-500 hover:underline ${(isResending || countdown > 0) ? 'opacity-50' : ''}`}
              >
                {isResending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationModal