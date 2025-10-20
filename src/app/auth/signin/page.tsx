'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, Users, Shield, CheckCircle, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Fetch session to get user role
        const session = await getSession();
        
        if (session?.user?.role === 'super_admin') {
          router.push('/super-admin');
        } else {
          router.push('/admin');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Side - Sign In Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  Private Dining Pros
                </h1>
                <p className="text-sm text-gray-500">Admin Portal</p>
              </div>
            </div>
            <p className="text-gray-600 text-lg">Sign in to manage restaurants and elevate private dining experiences</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border-2 border-red-200 animate-in slide-in-from-top duration-300">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowRight className="h-4 w-4 mr-2 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to Homepage
            </Link>
          </div>
        </div>

        {/* Right Side - Information */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-3">
              Join Our Community
            </h2>
            <p className="text-gray-600 text-lg">Help us build the most comprehensive private dining directory</p>
          </div>

          {/* User Roles */}
          <div className="space-y-4">
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg mr-3">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Super Admin</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 ml-1">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />Manage all restaurants and users</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />Approve/reject submissions</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />Full system access and control</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />Analytics and reporting</li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 hover:shadow-lg hover:border-green-400 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Admin</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 ml-1">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />Add and edit restaurants</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />Review submissions</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />Manage restaurant data</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />Moderate content</li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5 hover:shadow-lg hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mr-3">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Contributor</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 ml-1">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />Submit new restaurants</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />Suggest updates to listings</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />Help grow our database</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />Earn recognition</li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center space-y-4">
            <Link 
              href="/" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
            >
              Browse Restaurants
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-gray-600 px-4">
              Don&apos;t have an account? <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">Contact us</Link> to get started contributing!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 