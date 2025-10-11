'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <Image 
                src="/logo1.png" 
                alt="PrivateDiningPros Logo" 
                width={56} 
                height={56} 
                className="h-14 w-14 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                PrivateDiningPros
              </span>
              <span className="text-xs text-gray-500 font-medium">
                NYC Private Dining Directory
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className="px-5 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium relative group"
            >
              Restaurants
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></div>
            </Link>
            <Link 
              href="/map" 
              className="px-5 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium relative group"
            >
              Map
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></div>
            </Link>
            <Link 
              href="/about" 
              className="px-5 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium relative group"
            >
              About
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></div>
            </Link>
            <Link 
              href="/suggest" 
              className="px-5 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium relative group"
            >
              Suggest Restaurant
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></div>
            </Link>
            <Link 
              href="/contact" 
              className="px-5 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium relative group"
            >
              Contact
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></div>
            </Link>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/admin" 
                  className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <User className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
                {session.user?.role === 'super_admin' && (
                  <Link 
                    href="/super-admin" 
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <User className="h-5 w-5" />
                    <span>Super Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 relative"
          >
            <div className="relative">
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              {!isMenuOpen && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              )}
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-6 bg-gradient-to-b from-white to-gray-50">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="px-5 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                🏪 Restaurants
              </Link>
              <Link 
                href="/map" 
                className="px-5 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                🗺️ Map
              </Link>
              <Link 
                href="/about" 
                className="px-5 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                ℹ️ About
              </Link>
              <Link 
                href="/suggest" 
                className="px-5 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                ➕ Suggest Restaurant
              </Link>
              <Link 
                href="/contact" 
                className="px-5 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                📞 Contact
              </Link>
              
              {session ? (
                <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200 mt-6">
                  <Link 
                    href="/admin" 
                    className="flex items-center space-x-3 px-5 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-6 w-6" />
                    <span>Admin Panel</span>
                  </Link>
                  {session.user?.role === 'super_admin' && (
                    <Link 
                      href="/super-admin" 
                      className="flex items-center space-x-3 px-5 py-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium text-base"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-6 w-6" />
                      <span>Super Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-5 py-4 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-base"
                  >
                    <LogOut className="h-6 w-6" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-6 border-t border-gray-200 mt-6">
                  <Link 
                    href="/auth/signin" 
                    className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-center font-medium shadow-md text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 