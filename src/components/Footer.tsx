import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-violet-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-4 lg:gap-8 ">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/MOBIPHLEB_logo_purple.png"
                  alt="MOBIPHLEB"
                  className="h-24 w-auto object-contain"
                />
              </div>
              <p className="text-white mb-6 leading-relaxed">
                Professional mobile phlebotomy services bringing laboratory-quality testing to your doorstep. 
                Experience convenience, safety, and reliability with our certified professionals.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to={"/individual-booking"} className="text-white hover:text-purple-300 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 group-hover:bg-purple-300 transition-colors"></span>
                  Individual Booking
                </Link></li>
                <li><Link to={"/corporate-services"} className="text-white hover:text-purple-300 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 group-hover:bg-purple-300 transition-colors"></span>
                  Corporate Services
                </Link></li>
                <li><Link to={"/about"} className="text-white hover:text-purple-300 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 group-hover:bg-purple-300 transition-colors"></span>
                  About Us
                </Link></li>
                <li><Link to={"/contact"} className="text-white hover:text-purple-300 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 group-hover:bg-purple-300 transition-colors"></span>
                  Contact
                </Link></li>
                <li><Link to={"/terms"} className="text-white hover:text-purple-300 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 group-hover:bg-purple-300 transition-colors"></span>
                  Terms/Policy
                </Link></li>
              </ul>
            </div>

            <div className="pr-2">
              <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">info@mobiphleb.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center mt-0.5">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">Serving Greater Metro Area</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              &copy; 2025 <span className="text-purple-300 font-semibold">MOBIPHLEB</span>. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Professional Mobile Phlebotomy Services
            </p>
          </div>
        </div>
      </footer>
    
  );
}

