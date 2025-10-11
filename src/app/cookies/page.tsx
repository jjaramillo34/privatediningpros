'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Settings, BarChart3, Shield, Clock, Globe, Monitor, AlertTriangle, Mail, MapPin, Phone, Calendar, Info, CheckCircle, ExternalLink, Eye, Lock, Zap, FileText, Menu, X, ChevronRight, Download } from 'lucide-react';

export default function CookiePolicyPage() {
  const [activeSection, setActiveSection] = useState('what-are-cookies');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const sections = [
    { id: 'what-are-cookies', title: '1. What Are Cookies', icon: Info },
    { id: 'how-we-use', title: '2. How We Use Cookies', icon: Settings },
    { id: 'types-of-cookies', title: '3. Types of Cookies', icon: Cookie },
    { id: 'third-party-cookies', title: '4. Third-Party Cookies', icon: Globe },
    { id: 'cookie-duration', title: '5. Cookie Duration', icon: Clock },
    { id: 'managing-cookies', title: '6. Managing Cookies', icon: Monitor },
    { id: 'impact-disabling', title: '7. Impact of Disabling', icon: AlertTriangle },
    { id: 'policy-updates', title: '8. Policy Updates', icon: FileText },
    { id: 'contact', title: '9. Contact Us', icon: Mail }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
    setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-8 shadow-2xl border border-white/30">
              <Cookie className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Cookie Policy
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto leading-relaxed">
              Understanding how we use cookies to improve your experience
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-lg text-white rounded-xl border border-white/30">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="font-medium">Last updated: {new Date().toLocaleDateString()}</span>
              </div>
              <button className="inline-flex items-center px-6 py-3 bg-white text-amber-600 rounded-xl border border-white/30 hover:bg-amber-50 transition-colors shadow-lg">
                <Download className="h-5 w-5 mr-2" />
                <span className="font-medium">Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-24 right-4 z-50">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="bg-white rounded-xl shadow-xl p-3 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {showMobileMenu ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Desktop */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="text-left">{section.title}</span>
                      <ChevronRight className={`h-4 w-4 ml-auto ${activeSection === section.id ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
              <div className="absolute top-24 right-4 left-4 bg-white rounded-2xl p-6 shadow-2xl max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-amber-600" />
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="text-left">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* What Are Cookies Section */}
            <section id="what-are-cookies" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">1. What Are Cookies</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners about user behavior and preferences.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <Clock className="h-5 w-5 text-blue-500 mr-2" />
                        <h4 className="font-bold text-blue-800">Persistent Cookies</h4>
                      </div>
                      <p className="text-gray-700 text-sm md:text-base">Remain on your device when you go offline and can be used to remember your preferences</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <Zap className="h-5 w-5 text-purple-500 mr-2" />
                        <h4 className="font-bold text-purple-800">Session Cookies</h4>
                      </div>
                      <p className="text-gray-700 text-sm md:text-base">Deleted as soon as you close your browser and are used for temporary data storage</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Cookies Section */}
            <section id="how-we-use" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">2. How We Use Cookies</h2>
                </div>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                  We use cookies for several purposes, including:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Essential Cookies',
                      description: 'These cookies are necessary for the website to function properly and cannot be disabled.',
                      icon: Shield,
                      color: 'from-emerald-500 to-teal-500',
                      bgColor: 'from-emerald-50 to-teal-50',
                      borderColor: 'border-emerald-200'
                    },
                    {
                      title: 'Analytics Cookies',
                      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
                      icon: BarChart3,
                      color: 'from-blue-500 to-indigo-500',
                      bgColor: 'from-blue-50 to-indigo-50',
                      borderColor: 'border-blue-200'
                    },
                    {
                      title: 'Functional Cookies',
                      description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences.',
                      icon: Zap,
                      color: 'from-purple-500 to-pink-500',
                      bgColor: 'from-purple-50 to-pink-50',
                      borderColor: 'border-purple-200'
                    },
                    {
                      title: 'Marketing Cookies',
                      description: 'These cookies are used to track visitors across websites to display relevant and engaging advertisements.',
                      icon: Eye,
                      color: 'from-amber-500 to-orange-500',
                      bgColor: 'from-amber-50 to-orange-50',
                      borderColor: 'border-amber-200'
                    }
                  ].map((item, index) => (
                    <div key={index} className={`bg-gradient-to-r ${item.bgColor} rounded-xl p-6 ${item.borderColor} border hover:shadow-md transition-shadow`}>
                      <div className="flex items-center mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mr-3`}>
                          <item.icon className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                      </div>
                      <p className="text-gray-700 text-sm md:text-base">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Types of Cookies Section */}
            <section id="types-of-cookies" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                    <Cookie className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">3. Types of Cookies We Use</h2>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">3.1 Essential Cookies</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-base md:text-lg">
                      These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Authentication cookies to keep you logged in',
                        'Security cookies to protect against fraud',
                        'Session cookies to maintain your session',
                        'Load balancing cookies',
                        'Form submission cookies',
                        'User preference cookies'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm md:text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <BarChart3 className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">3.2 Analytics Cookies</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-base md:text-lg">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Page view tracking',
                        'User behavior analysis',
                        'Performance monitoring',
                        'Error tracking',
                        'Search query analytics',
                        'Map interaction tracking'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm md:text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">3.3 Functional Cookies</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-base md:text-lg">
                      These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Language preferences',
                        'Theme preferences',
                        'Filter preferences',
                        'Sort preferences',
                        'Map view settings',
                        'Favorite restaurants'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm md:text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies Section */}
            <section id="third-party-cookies" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">4. Third-Party Cookies</h2>
                </div>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                  In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements, and provide enhanced functionality.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <BarChart3 className="h-6 w-6 text-amber-500 mr-3" />
                      <h3 className="text-lg md:text-xl font-bold text-amber-800">4.1 Google Analytics</h3>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base mb-3">
                      We use Google Analytics to analyze the use of our website. Google Analytics gathers information about website use by means of cookies. The information gathered is used to create reports about the use of our website.
                    </p>
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors text-sm"
                    >
                      <span>Learn more about Google&apos;s privacy policy</span>
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <Eye className="h-6 w-6 text-purple-500 mr-3" />
                      <h3 className="text-lg md:text-xl font-bold text-purple-800">4.2 Social Media Cookies</h3>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base">
                      Our website may include social media features, such as sharing buttons. These features may set cookies to enable the feature to function properly.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <Globe className="h-6 w-6 text-teal-500 mr-3" />
                      <h3 className="text-lg md:text-xl font-bold text-teal-800">4.3 Mapbox Cookies</h3>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base mb-3">
                      We use Mapbox to provide interactive maps. Mapbox may set cookies to enable map functionality and track usage.
                    </p>
                    <a
                      href="https://www.mapbox.com/legal/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors text-sm"
                    >
                      <span>Learn more about Mapbox&apos;s privacy policy</span>
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookie Duration Section */}
            <section id="cookie-duration" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">5. Cookie Duration</h2>
                </div>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                  Cookies have different lifespans depending on their purpose:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                    <div className="flex items-center mb-3">
                      <Zap className="h-6 w-6 text-teal-500 mr-3" />
                      <h4 className="font-bold text-teal-800">Session Cookies</h4>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base mb-3">These cookies are temporary and are deleted when you close your browser.</p>
                    <div className="text-xs text-gray-500">Duration: Until browser closes</div>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center mb-3">
                      <Lock className="h-6 w-6 text-indigo-500 mr-3" />
                      <h4 className="font-bold text-indigo-800">Persistent Cookies</h4>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base mb-3">These cookies remain on your device for a set period or until you delete them manually.</p>
                    <div className="text-xs text-gray-500">Duration: Up to 2 years</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Managing Cookies Section */}
            <section id="managing-cookies" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">6. Managing Cookies</h2>
                </div>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                  You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <Monitor className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">6.1 Browser Settings</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                      Most web browsers allow you to manage cookies through their settings preferences. To learn more about how to manage cookies in your browser:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                        { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop' },
                        { name: 'Microsoft Edge', url: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
                        { name: 'Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac' }
                      ].map((browser, index) => (
                        <a
                          key={index}
                          href={browser.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                        >
                          {browser.name}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">6.2 Opt-Out Tools</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                      You can also opt out of certain types of cookies using these tools:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { name: 'Google Analytics Opt-out', url: 'https://tools.google.com/dlpage/gaoptout' },
                        { name: 'Network Advertising Initiative', url: 'https://www.networkadvertising.org/choices/' },
                        { name: 'Digital Advertising Alliance', url: 'https://optout.aboutads.info/' }
                      ].map((tool, index) => (
                        <a
                          key={index}
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200"
                        >
                          <span className="text-sm">{tool.name}</span>
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Impact of Disabling Cookies Section */}
            <section id="impact-disabling" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">7. Impact of Disabling Cookies</h2>
                </div>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                  If you choose to disable cookies, some features of our website may not function properly. This may affect your ability to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Stay logged in to your account',
                    'Remember your preferences and settings',
                    'Use certain interactive features',
                    'Receive personalized content',
                    'Save favorite restaurants',
                    'Use advanced map features',
                    'Submit restaurant suggestions',
                    'Access admin features'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Updates to Policy Section */}
            <section id="policy-updates" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">8. Updates to This Policy</h2>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                  <div className="flex items-start">
                    <Info className="h-6 w-6 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-base md:text-lg">
                      We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the &quot;Last updated&quot; date.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="scroll-mt-24">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-white/20 shadow-xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">9. Contact Us</h2>
                  <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    If you have any questions about our use of cookies, please contact us at:
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Mail className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                      <a href="mailto:privacy@privatediningpros.com" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                        privacy@privatediningpros.com
                      </a>
                    </div>
                    
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Address</h3>
                      <p className="text-purple-600 font-medium">368 9th Avenue<br />New York, NY 10001<br />Hell&apos;s Kitchen, Manhattan</p>
                    </div>
                    
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                      <a href="tel:+13472399026" className="text-pink-600 font-medium hover:text-pink-700 transition-colors">
                        +1 (347) 239-9026
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}