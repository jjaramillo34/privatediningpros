'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, Users, Globe, Cookie, Settings, Mail, MapPin, Phone, Calendar, CheckCircle, AlertTriangle, Info, Menu, X, ChevronRight, Download, ExternalLink } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const sections = [
    { id: 'introduction', title: '1. Introduction', icon: Info },
    { id: 'information-collection', title: '2. Information We Collect', icon: FileText },
    { id: 'information-use', title: '3. How We Use Information', icon: Settings },
    { id: 'information-sharing', title: '4. Information Sharing', icon: Eye },
    { id: 'data-security', title: '5. Data Security', icon: Lock },
    { id: 'cookies', title: '6. Cookies & Tracking', icon: Cookie },
    { id: 'your-rights', title: '7. Your Rights', icon: CheckCircle },
    { id: 'children-privacy', title: '8. Children\'s Privacy', icon: Users },
    { id: 'international-transfers', title: '9. International Transfers', icon: Globe },
    { id: 'policy-changes', title: '10. Changes to Policy', icon: FileText },
    { id: 'contact', title: '11. Contact Us', icon: Mail }
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
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-8 shadow-2xl border border-white/30">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your privacy and data security are our top priorities
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-lg text-white rounded-xl border border-white/30">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="font-medium">Last updated: {new Date().toLocaleDateString()}</span>
              </div>
              <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl border border-white/30 hover:bg-blue-50 transition-colors shadow-lg">
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
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
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
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
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
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
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
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
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
            {/* Introduction Section */}
            <section id="introduction" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">1. Introduction</h2>
                </div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Welcome to PrivateDiningPros (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
              </div>
            </section>

            {/* Information Collection Section */}
            <section id="information-collection" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">2. Information We Collect</h2>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">2.1 Personal Information</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-base md:text-lg">
                      We may collect personal information that you voluntarily provide to us when you:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {[
                        'Create an account or sign up for our services',
                        'Contact us through our contact forms',
                        'Subscribe to our newsletter',
                        'Suggest a restaurant for listing',
                        'Participate in surveys or promotions',
                        'Apply for admin access'
                      ].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm md:text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-600 text-base md:text-lg">
                      This information may include your name, email address, phone number, and any other information you choose to provide.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                        <Globe className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">2.2 Automatically Collected Information</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-base md:text-lg">
                      When you visit our website, we automatically collect certain information about your device, including:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'IP address and location data',
                        'Browser type and version',
                        'Operating system',
                        'Pages visited and time spent',
                        'Referring website',
                        'Device information',
                        'Search queries',
                        'Interaction with map features'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="text-gray-600 text-sm md:text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Information Section */}
            <section id="information-use" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">3. How We Use Your Information</h2>
                </div>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                  We use the information we collect to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Provide and maintain our services',
                    'Process restaurant suggestions and submissions',
                    'Display restaurant information and maps',
                    'Process and respond to your inquiries',
                    'Send you administrative information and updates',
                    'Improve our website and user experience',
                    'Analyze usage patterns and trends',
                    'Prevent fraud and ensure security',
                    'Personalize your experience',
                    'Comply with legal obligations'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Information Sharing Section */}
            <section id="information-sharing" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">4. Information Sharing and Disclosure</h2>
                </div>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Service Providers',
                      description: 'We may share information with trusted third-party service providers who assist us in operating our website, including Mapbox for map services, ImageKit for image hosting, and authentication providers.'
                    },
                    {
                      title: 'Restaurant Partners',
                      description: 'When you submit a restaurant suggestion or contact a restaurant through our platform, we may share your contact information with the relevant restaurant.'
                    },
                    {
                      title: 'Legal Requirements',
                      description: 'We may disclose information if required by law, court order, or to protect our rights, property, and safety or that of others.'
                    },
                    {
                      title: 'Business Transfers',
                      description: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.'
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200 hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-violet-800 mb-2">{item.title}</h4>
                      <p className="text-gray-700 text-sm md:text-base">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Data Security Section */}
            <section id="data-security" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">5. Data Security</h2>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 text-base md:text-lg mb-4">
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                      </p>
                      <p className="text-gray-700 text-base md:text-lg">
                        However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies Section */}
            <section id="cookies" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <Cookie className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">6. Cookies and Tracking Technologies</h2>
                </div>
                <p className="text-gray-600 text-base md:text-lg mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
                </p>
                <Link 
                  href="/cookies"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <span>View our detailed Cookie Policy</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </section>

            {/* Your Rights Section */}
            <section id="your-rights" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">7. Your Rights and Choices</h2>
                </div>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'The right to access and receive a copy of your personal information',
                    'The right to rectify inaccurate personal information',
                    'The right to delete your personal information',
                    'The right to restrict processing of your personal information',
                    'The right to data portability',
                    'The right to object to processing',
                    'The right to withdraw consent',
                    'The right to lodge a complaint with a supervisory authority'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Children's Privacy Section */}
            <section id="children-privacy" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">8. Children&apos;s Privacy</h2>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start">
                    <Info className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-base md:text-lg">
                      Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take steps to remove such information.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* International Transfers Section */}
            <section id="international-transfers" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">9. International Data Transfers</h2>
                </div>
                <p className="text-gray-600 text-base md:text-lg">
                  Your information may be transferred to and processed in countries other than your own, including the United States. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
                </p>
              </div>
            </section>

            {/* Changes to Policy Section */}
            <section id="policy-changes" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">10. Changes to This Privacy Policy</h2>
                </div>
                <p className="text-gray-600 text-base md:text-lg">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="scroll-mt-24">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-white/20 shadow-xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">11. Contact Us</h2>
                  <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
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
