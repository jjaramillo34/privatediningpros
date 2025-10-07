import { Heart, Coffee, Github, ExternalLink, Code, Globe, Star, Award, Mail, Linkedin, Twitter, Search, Zap, Shield, Rocket, Crown, Eye, Target, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 sm:mb-8 shadow-xl animate-bounce">
              <Award className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
              About PrivateDiningPros
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Your trusted partner in finding the perfect private dining experiences across New York City.
            </p>
            {/* Stats */}
            <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">1,500+</div>
                <div className="text-xs sm:text-sm text-gray-600">Restaurants</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">100%</div>
                <div className="text-xs sm:text-sm text-gray-600">Free</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Available</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold text-pink-600">NYC</div>
                <div className="text-xs sm:text-sm text-gray-600">Focused</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-0 sm:mr-4 mb-3 sm:mb-0">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              We connect discerning diners with the finest restaurants offering private dining rooms. 
              Whether you&apos;re planning a business meeting, celebrating a special occasion, or hosting 
              an intimate gathering, we help you find the perfect venue.
            </p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-0 sm:mr-4 mb-3 sm:mb-0">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What We Offer</h2>
            </div>
            <ul className="text-base sm:text-lg text-gray-600 space-y-2 sm:space-y-3">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Curated selection of premium restaurants</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Detailed information about private rooms</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Capacity and amenities for each venue</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Contact information and booking details</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Reviews and ratings from real customers</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Why Choose Private Dining */}
        <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-16 sm:mb-20 border border-white/20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">Why Choose Private Dining?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 sm:mb-3">Privacy</div>
              <p className="text-gray-600 text-base sm:text-lg">Enjoy intimate conversations without distractions</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2 sm:mb-3">Exclusivity</div>
              <p className="text-gray-600 text-base sm:text-lg">Reserved spaces for your special occasions</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-2 sm:mb-3">Service</div>
              <p className="text-gray-600 text-base sm:text-lg">Dedicated attention from restaurant staff</p>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-16 sm:mb-20 border border-white/20 shadow-xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-4 sm:mb-6 shadow-lg">
              <Code className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Meet the Developer</h2>
            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Javier Jaramillo</h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
                A passionate full-stack developer with expertise in modern web technologies. 
                Javier created PrivateDiningPros to solve a real-world problem: finding quality 
                private dining venues for special occasions and business meetings.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">1,500+</div>
                  <p className="text-sm sm:text-base text-gray-600">Restaurants Listed</p>
                </div>
                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl font-bold text-teal-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                  <p className="text-sm sm:text-base text-gray-600">Free Service</p>
                </div>
                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <p className="text-sm sm:text-base text-gray-600">Available</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <a
                  href="https://github.com/javierjaramillo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all duration-300 text-xs sm:text-sm font-medium hover:scale-105 shadow-lg"
                >
                  <Github className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/javierjaramillo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-all duration-300 text-xs sm:text-sm font-medium hover:scale-105 shadow-lg"
                >
                  <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  LinkedIn
                </a>
                <a
                  href="https://twitter.com/javierjaramillo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-400 text-white rounded-lg sm:rounded-xl hover:bg-blue-500 transition-all duration-300 text-xs sm:text-sm font-medium hover:scale-105 shadow-lg"
                >
                  <Twitter className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  Twitter
                </a>
                <a
                  href="mailto:javier@privatediningpros.com"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white rounded-lg sm:rounded-xl hover:bg-emerald-700 transition-all duration-300 text-xs sm:text-sm font-medium hover:scale-105 shadow-lg"
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Open Source Section */}
        <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 rounded-3xl p-12 mb-20 border border-white/20 shadow-xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Open Source Project</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              PrivateDiningPros is an open source project built with modern web technologies including 
              Next.js, TypeScript, Tailwind CSS, and MongoDB. We believe in transparency, community 
              collaboration, and making quality tools accessible to everyone. The source code is freely 
              available for learning, modification, and contribution.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <a
                href="https://github.com/privatediningpros/website"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium hover:scale-105 shadow-lg"
              >
                <Github className="h-6 w-6 mr-3" />
                View on GitHub
                <ExternalLink className="h-5 w-5 ml-2" />
              </a>
              <a
                href="https://github.com/privatediningpros/website/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium hover:scale-105 shadow-lg"
              >
                Documentation
                <ExternalLink className="h-5 w-5 ml-2" />
              </a>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-12 mb-20 border border-white/20 shadow-xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-6 shadow-lg">
              <Coffee className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Support the Project</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              PrivateDiningPros is completely free to use and will always remain so. However, 
              maintaining and improving this platform requires time, effort, and resources. 
              Your contributions help us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="text-center group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🚀</div>
                <p className="text-gray-600 font-medium">Add new features and improvements</p>
              </div>
              <div className="text-center group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🛠️</div>
                <p className="text-gray-600 font-medium">Maintain server costs and infrastructure</p>
              </div>
              <div className="text-center group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📊</div>
                <p className="text-gray-600 font-medium">Keep the restaurant database updated</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.buymeacoffee.com/privatediningpros"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-300 font-medium hover:scale-105 shadow-lg"
              >
                <Coffee className="h-6 w-6 mr-3" />
                Buy Me a Coffee
                <ExternalLink className="h-5 w-5 ml-2" />
              </a>
              <a
                href="https://github.com/sponsors/privatediningpros"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 font-medium hover:scale-105 shadow-lg"
              >
                <Github className="h-6 w-6 mr-3" />
                GitHub Sponsors
                <ExternalLink className="h-5 w-5 ml-2" />
              </a>
              <a
                href="https://paypal.me/privatediningpros"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium hover:scale-105 shadow-lg"
              >
                PayPal Donation
                <ExternalLink className="h-5 w-5 ml-2" />
              </a>
            </div>
            <p className="text-gray-500 mt-6 font-medium">
              Every contribution, no matter how small, helps keep PrivateDiningPros free and growing!
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 mb-20 shadow-xl border border-white/20">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Search & Filtering</h3>
                <p className="text-gray-600">Find restaurants by location, cuisine, price range, and ratings</p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Private Room Details</h3>
                <p className="text-gray-600">Complete information about capacity, amenities, and booking</p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Reviews</h3>
                <p className="text-gray-600">Real customer experiences and ratings for each venue</p>
              </div>
            </div>
            <div className="flex items-start group">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Contact</h3>
                <p className="text-gray-600">Phone numbers and websites for easy booking</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 shadow-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Ready to Find Your Perfect Venue?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Browse our collection of over 1,500 restaurants with private dining rooms and start planning 
            your next memorable dining experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              <Rocket className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              Browse Restaurants
            </Link>
            <Link 
              href="/map" 
              className="inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 border-2 border-blue-600 text-blue-600 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              View Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 