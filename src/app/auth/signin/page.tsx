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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Sign In Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Private Dining Pros</h1>
            </div>
            <p className="text-gray-600">Sign in to manage restaurants and contribute to our community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 font-medium"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

        </div>

        {/* Right Side - Information */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-gray-600">Help us build the most comprehensive private dining directory</p>
          </div>

          {/* User Roles */}
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Super Admin</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Manage all restaurants and users</li>
                <li>• Approve/reject community submissions</li>
                <li>• Full system access and control</li>
                <li>• Analytics and reporting</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Users className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Admin</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add and edit restaurants</li>
                <li>• Review community submissions</li>
                <li>• Manage restaurant data</li>
                <li>• Moderate content</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Heart className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Community Contributor</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Submit new restaurants for approval</li>
                <li>• Suggest updates to existing listings</li>
                <li>• Help grow our database</li>
                <li>• Earn recognition for contributions</li>
              </ul>
            </div>
          </div>

          {/* Community Contribution Process */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              How Community Contributions Work
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                <div>
                  <strong>Submit a Restaurant:</strong> Fill out the restaurant form with all details
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                <div>
                  <strong>Review Process:</strong> Our admins review your submission for accuracy
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                <div>
                  <strong>Approval:</strong> Approved restaurants are added to our public directory
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
                <div>
                  <strong>Recognition:</strong> Get credit for your contributions and help others find great venues
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              Browse Restaurants
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <p className="text-xs text-gray-500 mt-2">
              Don&apos;t have an account? Contact us to get started contributing!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 