import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, Coffee, Github, Utensils, Calendar, Briefcase, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Logo Section - Centered at Top */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <div className="relative mb-3">
              <Image 
                src="/logo_black.png" 
                alt="PrivateDiningPros Logo" 
                width={60} 
                height={60} 
                className="h-15 w-15"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
              PrivateDiningPros
            </span>
            <p className="text-xs md:text-sm text-gray-400 font-medium mb-2">NYC Private Dining Directory</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="text-sm md:text-base">Restaurants</span>
                </Link>
              </li>
              <li>
                <Link href="/map" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="text-sm md:text-base">Explore Map</span>
                </Link>
              </li>
              <li>
                <Link href="/suggest" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="text-sm md:text-base">Suggest Restaurant</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="text-sm md:text-base">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="text-sm md:text-base">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?category=restaurants" className="flex items-center text-gray-300 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200 group">
                  <div className="p-1.5 bg-emerald-500/20 rounded-lg mr-3 group-hover:bg-emerald-500/30 transition-colors duration-200">
                    <Utensils className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-sm md:text-base">Private Dining</span>
                </Link>
              </li>
              <li>
                <Link href="/?occasion=event" className="flex items-center text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 group">
                  <div className="p-1.5 bg-blue-500/20 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors duration-200">
                    <Calendar className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-sm md:text-base">Event Planning</span>
                </Link>
              </li>
              <li>
                <Link href="/?occasion=corporate" className="flex items-center text-gray-300 hover:text-purple-400 hover:translate-x-1 transition-all duration-200 group">
                  <div className="p-1.5 bg-purple-500/20 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-colors duration-200">
                    <Briefcase className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-sm md:text-base">Corporate Events</span>
                </Link>
              </li>
              <li>
                <Link href="/?occasion=wedding" className="flex items-center text-gray-300 hover:text-pink-400 hover:translate-x-1 transition-all duration-200 group">
                  <div className="p-1.5 bg-pink-500/20 rounded-lg mr-3 group-hover:bg-pink-500/30 transition-colors duration-200">
                    <Sparkles className="h-4 w-4 text-pink-400" />
                  </div>
                  <span className="text-sm md:text-base">Wedding Venues</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white">Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200 group">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-200 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-gray-300 text-sm md:text-base leading-relaxed">
                    <strong className="text-white">368 9th Avenue</strong><br />
                    New York, NY 10001<br />
                    <span className="text-gray-400 text-xs">Hell&apos;s Kitchen, Manhattan</span>
                  </span>
                </div>
              </div>
              <a href="tel:+13472399026" className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200 group">
                <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors duration-200">
                  <Phone className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-sm md:text-base font-medium">
                  +1 (347) 239-9026
                </span>
              </a>
              <a href="mailto:info@privatediningpros.com" className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200 group">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors duration-200">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-gray-300 hover:text-purple-400 transition-colors duration-200 text-sm md:text-base font-medium break-all">
                  info@privatediningpros.com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Social Media - Centered */}
        <div className="flex justify-center space-x-4 mb-8">
          <a href="#" className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200 transform hover:scale-110">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200 transform hover:scale-110">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="p-3 text-gray-400 hover:text-pink-400 hover:bg-pink-400/10 rounded-lg transition-all duration-200 transform hover:scale-110">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200 transform hover:scale-110">
            <Linkedin className="h-6 w-6" />
          </a>
        </div>

        {/* Donation Section */}
        <div className="border-t border-gray-700 pt-6 mb-6">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-3 flex items-center justify-center">
              <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-400 mr-2 animate-pulse" />
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Support Our Mission
              </span>
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mb-4 max-w-2xl mx-auto leading-relaxed">
              PrivateDiningPros is a free platform helping thousands discover the perfect private dining experience in NYC. 
              If you find it helpful, consider supporting our mission.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://buymeacoffee.com/jjaramillo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Coffee className="h-4 w-4 mr-1" />
                Buy Me a Coffee
              </a>
              <a
                href="https://github.com/sponsors/jjaramillo34"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Github className="h-4 w-4 mr-1" />
                GitHub Sponsors
              </a>
              <a
                href="https://whydonate.com/fundraising/private-dining-pros"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Heart className="h-4 w-4 mr-1" />
                Direct Donation
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-gray-400 text-xs md:text-sm">
                © {new Date().getFullYear()} PrivateDiningPros. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Connecting NYC with exceptional private dining experiences
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-3 text-xs md:text-sm">
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
