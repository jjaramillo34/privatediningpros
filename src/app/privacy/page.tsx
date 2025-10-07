import { Shield, Lock, Eye, FileText, Users, Globe, Cookie, Settings, Mail, MapPin, Phone, Calendar, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8 shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your privacy and data security are our top priorities
            </p>
            <div className="mt-8 inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="font-medium">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Introduction Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
              <Info className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">1. Introduction</h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to PrivateDiningPros (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </div>

        {/* Information Collection Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">2. Information We Collect</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">2.1 Personal Information</h3>
              </div>
              <p className="text-gray-600 mb-4 text-lg">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {[
                  'Create an account or sign up for our services',
                  'Contact us through our contact forms',
                  'Subscribe to our newsletter',
                  'Participate in surveys or promotions',
                  'Apply for admin access'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-lg">
                This information may include your name, email address, phone number, and any other information you choose to provide.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">2.2 Automatically Collected Information</h3>
              </div>
              <p className="text-gray-600 mb-4 text-lg">
                When you visit our website, we automatically collect certain information about your device, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'IP address',
                  'Browser type and version',
                  'Operating system',
                  'Pages visited and time spent on each page',
                  'Referring website',
                  'Device information'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How We Use Information Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">3. How We Use Your Information</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            We use the information we collect to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Provide and maintain our services',
              'Process and respond to your inquiries',
              'Send you administrative information and updates',
              'Improve our website and user experience',
              'Analyze usage patterns and trends',
              'Prevent fraud and ensure security',
              'Comply with legal obligations'
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Information Sharing Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">4. Information Sharing and Disclosure</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
          </p>
          <div className="space-y-4">
            {[
              {
                title: 'Service Providers',
                description: 'We may share information with trusted third-party service providers who assist us in operating our website and providing services.'
              },
              {
                title: 'Legal Requirements',
                description: 'We may disclose information if required by law or to protect our rights and safety.'
              },
              {
                title: 'Business Transfers',
                description: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200">
                <h4 className="font-bold text-violet-800 mb-2">{item.title}</h4>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Security Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">5. Data Security</h2>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-gray-700 text-lg">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
              <Cookie className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">6. Cookies and Tracking Technologies</h2>
          </div>
          <p className="text-gray-600 text-lg">
            We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences. For more information, please see our Cookie Policy.
          </p>
        </div>

        {/* Your Rights Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">7. Your Rights and Choices</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'The right to access and receive a copy of your personal information',
              'The right to rectify inaccurate personal information',
              'The right to delete your personal information',
              'The right to restrict processing of your personal information',
              'The right to data portability',
              'The right to object to processing'
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Children's Privacy Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">8. Children&apos;s Privacy</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-gray-700 text-lg">
                Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </div>
          </div>
        </div>

        {/* International Transfers Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">9. International Data Transfers</h2>
          </div>
          <p className="text-gray-600 text-lg">
            Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws.
          </p>
        </div>

        {/* Changes to Policy Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">10. Changes to This Privacy Policy</h2>
          </div>
          <p className="text-gray-600 text-lg">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-12 border border-white/20 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">11. Contact Us</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-blue-600 font-medium">privacy@privatediningpros.com</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Address</h3>
                <p className="text-purple-600 font-medium">123 Business Ave, Suite 100<br />New York, NY 10001</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-pink-600 font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 