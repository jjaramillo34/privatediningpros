import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, Coffee, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image 
                  src="/logo_black.png" 
                  alt="PrivateDiningPros Logo" 
                  width={40} 
                  height={40} 
                  className="h-10 w-10"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  PrivateDiningPros
                </span>
                <p className="text-xs text-gray-400 font-medium">NYC Private Dining</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover the finest restaurants with private dining rooms in New York City. 
              Perfect for business meetings, celebrations, and intimate gatherings.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200 transform hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200 transform hover:scale-110">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-pink-400 hover:bg-pink-400/10 rounded-lg transition-all duration-200 transform hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200 transform hover:scale-110">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/suggest" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Suggest Restaurant
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-green-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  🍽️ Private Dining
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-green-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  📅 Event Planning
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-green-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  🏢 Corporate Events
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-green-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  💒 Wedding Venues
                </a>
              </li>
            </ul>
          </div>


          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200 group">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-200">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-gray-300 text-sm leading-relaxed">
                    <strong className="text-white">368 9th Avenue</strong><br />
                    New York, NY 10001<br />
                    <span className="text-gray-400 text-xs">Hell&apos;s Kitchen, Manhattan</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200 group">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors duration-200">
                  <Phone className="h-5 w-5 text-green-400" />
                </div>
                <a href="tel:+1-555-123-4567" className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm font-medium">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200 group">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors duration-200">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <a href="mailto:info@privatediningpros.com" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 text-sm font-medium">
                  info@privatediningpros.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-400 mr-3 animate-pulse" />
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Support Our Mission
              </span>
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-2xl mx-auto leading-relaxed">
              PrivateDiningPros is a free platform helping thousands discover the perfect private dining experience in NYC. 
              If you find it helpful, consider supporting our mission to connect people with exceptional dining venues.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://buymeacoffee.com/jjaramillo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Coffee className="h-5 w-5 mr-2" />
                Buy Me a Coffee
              </a>
              <a
                href="https://github.com/sponsors/jjaramillo34"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub Sponsors
              </a>
              <a
                href="https://whydonate.com/fundraising/private-dining-pros"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Heart className="h-5 w-5 mr-2" />
                Direct Donation
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} PrivateDiningPros. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Connecting NYC with exceptional private dining experiences
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 font-medium">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 font-medium">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 