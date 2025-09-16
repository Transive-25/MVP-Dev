import { FaCar, FaMotorcycle, FaBicycle, FaQuestionCircle, FaArrowRight, FaChevronDown, FaArrowUp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
       <footer className="bg-gray-900 text-white py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <img src="./logo.png" className="w-10 h-10 mr-2" alt="Transive" />
                </div>
                <p className="text-gray-400">Moving you safely and comfortably to your destination.</p>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Services</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Rides</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Delivery</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Business</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Cities</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-400"><FaMapMarkerAlt className="mr-2" /> New York, NY</li>
                  <li className="flex items-center text-gray-400"><FaPhone className="mr-2" /> +1 (555) 123-4567</li>
                  <li className="flex items-center text-gray-400"><FaEnvelope className="mr-2" /> info@transive.com</li>
                  <li className="flex items-center mt-4 space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white"><FaFacebook /></a>
                    <a href="#" className="text-gray-400 hover:text-white"><FaTwitter /></a>
                    <a href="#" className="text-gray-400 hover:text-white"><FaInstagram /></a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>© {new Date().getFullYear()} Transive. All rights reserved.</p>
            </div>
          </footer>
  )
}

export default Footer