'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle, Shield, Users, AlertTriangle, Scale, Link as LinkIcon, Copyright, Mail, MapPin, Phone, Calendar, Info, Lock, Globe, Gavel, Menu, X, ChevronRight, Download, ExternalLink } from 'lucide-react';

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('acceptance');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms', icon: CheckCircle },
    { id: 'service-description', title: '2. Description of Service', icon: Globe },
    { id: 'user-accounts', title: '3. User Accounts', icon: Users },
    { id: 'acceptable-use', title: '4. Acceptable Use', icon: AlertTriangle },
    { id: 'intellectual-property', title: '5. Intellectual Property', icon: Copyright },
    { id: 'user-content', title: '6. User Content', icon: FileText },
    { id: 'disclaimers', title: '7. Disclaimers', icon: Info },
    { id: 'limitation-liability', title: '8. Limitation of Liability', icon: Scale },
    { id: 'third-party-links', title: '9. Third-Party Links', icon: LinkIcon },
    { id: 'indemnification', title: '10. Indemnification', icon: Shield },
    { id: 'governing-law', title: '11. Governing Law', icon: Gavel },
    { id: 'changes-to-terms', title: '12. Changes to Terms', icon: FileText },
    { id: 'contact', title: '13. Contact Information', icon: Mail }
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
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services
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
                      <span className="text-left text-xs">{section.title}</span>
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
                        <span className="text-left text-xs">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Acceptance of Terms Section */}
            <section id="acceptance" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start">
                    <Info className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-base md:text-lg">
                      By accessing and using PrivateDiningPros (&quot;the Website&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description of Service Section */}
            <section id="service-description" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">2. Description of Service</h2>
                </div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  PrivateDiningPros is a platform that provides information about restaurants with private dining rooms in New York City. We aggregate and display restaurant information, including contact details, private room specifications, location maps, and other relevant data to help users find suitable dining venues for their events.
                </p>
              </div>
            </section>

            {/* User Accounts Section */}
            <section id="user-accounts" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">3. User Accounts</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-base md:text-lg text-gray-600">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                  </p>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                    <div className="flex items-start">
                      <Lock className="h-6 w-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 text-base md:text-lg">
                        You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account, whether or not you have authorized such activities or actions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Acceptable Use Section */}
            <section id="acceptable-use" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">4. Acceptable Use</h2>
                </div>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                  You agree not to use the Website:
                </p>
                <div className="space-y-3">
                  {[
                    'In any way that violates any applicable federal, state, local, or international law or regulation',
                    'To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation',
                    'To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity',
                    'To engage in any other conduct that restricts or inhibits anyone\'s use or enjoyment of the Website',
                    'To introduce any viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful',
                    'To scrape, mine, or harvest data from the Website without permission'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Intellectual Property Rights Section */}
            <section id="intellectual-property" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <Copyright className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">5. Intellectual Property Rights</h2>
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                  <div className="flex items-start">
                    <Shield className="h-6 w-6 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-base md:text-lg">
                      The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by PrivateDiningPros, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Content Section */}
            <section id="user-content" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">6. User Content</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-base md:text-lg text-gray-600">
                    You may have the opportunity to submit content to the Website, including restaurant suggestions, reviews, or other information. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in any and all media.
                  </p>
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-violet-500 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 text-base md:text-lg">
                        You represent and warrant that any content you submit is your original work or that you have the right to grant us the license described above.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimers Section */}
            <section id="disclaimers" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl flex items-center justify-center mr-4">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">7. Disclaimers</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-base md:text-lg text-gray-600">
                    The information on this Website is provided &quot;as is&quot; without any representations or warranties, express or implied. PrivateDiningPros makes no representations or warranties in relation to this Website or the information and materials provided on this Website.
                  </p>
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start">
                      <AlertTriangle className="h-6 w-6 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 text-base md:text-lg">
                        We do not guarantee the accuracy, completeness, or usefulness of any information on the Website. We are not responsible for any decisions made based on the information provided on the Website. Restaurant details, availability, and pricing should be confirmed directly with the restaurant.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitation of Liability Section */}
            <section id="limitation-liability" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center mr-4">
                    <Scale className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">8. Limitation of Liability</h2>
                </div>
                <p className="text-gray-600 mb-6 text-base md:text-lg">
                  In no event shall PrivateDiningPros, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <div className="space-y-3">
                  {[
                    'Your use or inability to use the Website',
                    'Any unauthorized access to or use of our servers and/or any personal information stored therein',
                    'Any interruption or cessation of transmission to or from the Website',
                    'Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Website',
                    'Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, transmitted, or otherwise made available via the Website'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Third-Party Links Section */}
            <section id="third-party-links" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <LinkIcon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">9. Third-Party Links</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-base md:text-lg text-gray-600">
                    The Website may contain links to third-party websites or services that are not owned or controlled by PrivateDiningPros, including restaurant websites, booking platforms, and social media. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                  </p>
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-start">
                      <AlertTriangle className="h-6 w-6 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 text-base md:text-lg">
                        You acknowledge and agree that PrivateDiningPros shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Indemnification Section */}
            <section id="indemnification" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">10. Indemnification</h2>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-base md:text-lg">
                      You agree to defend, indemnify, and hold harmless PrivateDiningPros and its licensors and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to your violation of these Terms of Service or your use of the Website.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Governing Law Section */}
            <section id="governing-law" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mr-4">
                    <Gavel className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">11. Governing Law</h2>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-start">
                    <Scale className="h-6 w-6 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-base md:text-lg">
                      These Terms of Service and any dispute or claim arising out of or in connection with them or their subject matter or formation shall be governed by and construed in accordance with the laws of the State of New York, without giving effect to any choice or conflict of law provision or rule.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Changes to Terms Section */}
            <section id="changes-to-terms" className="scroll-mt-24 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">12. Changes to Terms</h2>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                  <div className="flex items-start">
                    <Info className="h-6 w-6 text-teal-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-base md:text-lg">
                      We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information Section */}
            <section id="contact" className="scroll-mt-24">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-white/20 shadow-xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">13. Contact Information</h2>
                  <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Mail className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                      <a href="mailto:legal@privatediningpros.com" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                        legal@privatediningpros.com
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
