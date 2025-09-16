import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaMotorcycle, FaBicycle, FaChevronDown} from 'react-icons/fa';
import Hero from '../../components/hero/Hero';

const Onboarding = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);


  const questions = [
    {
      id: 1,
      question: "How do I book a ride?",
      answer: "Simply open the app, enter your destination, and confirm your ride. A driver will be at your location shortly."
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and cash payments for your convenience."
    },
    {
      id: 3,
      question: "How long does driver arrival take?",
      answer: "Typically, our drivers arrive within 5-10 minutes depending on your location and traffic conditions."
    },
    {
      id: 4,
      question: "Can I schedule rides in advance?",
      answer: "Yes, you can schedule rides up to 24 hours in advance through our app."
    }
  ];

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setCurrentPage(Math.floor(scrollPosition / windowHeight));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
   

  
    <Hero/>

      {/* Services Section */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-black py-16 px-4">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Our Services
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: <FaCar size={50} />, title: "Car Ride", desc: "Comfortable rides for your daily commute" },
            { icon: <FaMotorcycle size={50} />, title: "Bike Ride", desc: "Quick and affordable rides through traffic" },
            { icon: <FaBicycle size={50} />, title: "Bicycle", desc: "Eco-friendly rides for short distances" }
          ].map((service, index) => (
            <motion.div 
              key={index}
              className="bg-gray-900 p-8 rounded-lg text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className="text-white mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-400">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-black py-16 px-4">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Frequently Asked Questions
        </motion.h2>
        
        <div className="max-w-3xl w-full mx-auto">
          {questions.map((q, index) => (
            <motion.div 
              key={q.id}
              className="mb-4 border-b border-gray-800"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button 
                className="flex justify-between items-center w-full py-4 text-left font-medium"
                onClick={() => toggleQuestion(q.id)}
              >
                <span>{q.question}</span>
                <motion.span
                  animate={{ rotate: activeQuestion === q.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown />
                </motion.span>
              </button>
              <AnimatePresence>
                {activeQuestion === q.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-gray-400">{q.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Download App Section */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-black py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Download the Transive App</h2>
            <p className="text-gray-400 mb-8">
              Get the app and experience seamless transportation at your fingertips. 
              Available on both iOS and Android platforms.
            </p>
            <div className="flex gap-4">
              <motion.button 
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                App Store
              </motion.button>
              <motion.button 
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Google Play
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl transform rotate-3">
              <div className="bg-black p-4 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <img src="./logo.png" className="w-10 h-10 mr-2" alt="Transive" />
                    <span className="font-bold">TRANSIVE</span>
                  </div>
                  <div className="text-sm">4.8 ★</div>
                </div>
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-white mr-2"></div>
                    <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-white mr-2"></div>
                    <div className="h-8 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="h-32 bg-gray-900 rounded-lg mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-10 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-10 bg-white rounded w-2/5"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Onboarding;