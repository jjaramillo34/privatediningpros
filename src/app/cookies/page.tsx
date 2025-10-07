import { Cookie, Settings, BarChart3, Shield, Clock, Globe, Monitor, AlertTriangle, Mail, MapPin, Phone, Calendar, Info, CheckCircle, ExternalLink, Eye, Lock, Zap, FileText } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8 shadow-xl">
              <Cookie className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Understanding how we use cookies to improve your experience
            </p>
            <div className="mt-8 inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="font-medium">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* What Are Cookies Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
              <Info className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">1. What Are Cookies</h2>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-600 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-3">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <h4 className="font-bold text-blue-800">Persistent Cookies</h4>
                </div>
                <p className="text-gray-700">Remain on your device when you go offline</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center mb-3">
                  <Zap className="h-5 w-5 text-purple-500 mr-2" />
                  <h4 className="font-bold text-purple-800">Session Cookies</h4>
                </div>
                <p className="text-gray-700">Deleted as soon as you close your browser</p>
              </div>
            </div>
          </div>
        </div>

        {/* How We Use Cookies Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">2. How We Use Cookies</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
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
                borderColor: 'emerald-200'
              },
              {
                title: 'Analytics Cookies',
                description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
                icon: BarChart3,
                color: 'from-blue-500 to-indigo-500',
                bgColor: 'from-blue-50 to-indigo-50',
                borderColor: 'blue-200'
              },
              {
                title: 'Functional Cookies',
                description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences.',
                icon: Zap,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50',
                borderColor: 'purple-200'
              },
              {
                title: 'Marketing Cookies',
                description: 'These cookies are used to track visitors across websites to display relevant and engaging advertisements.',
                icon: Eye,
                color: 'from-amber-500 to-orange-500',
                bgColor: 'from-amber-50 to-orange-50',
                borderColor: 'amber-200'
              }
            ].map((item, index) => (
              <div key={index} className={`bg-gradient-to-r ${item.bgColor} rounded-xl p-6 border border-${item.borderColor}`}>
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mr-3`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800">{item.title}</h4>
                </div>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Types of Cookies Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
              <Cookie className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">3. Types of Cookies We Use</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">3.1 Essential Cookies</h3>
              </div>
              <p className="text-gray-600 mb-4 text-lg">
                These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  'Authentication cookies to keep you logged in',
                  'Security cookies to protect against fraud',
                  'Session cookies to maintain your session'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">3.2 Analytics Cookies</h3>
              </div>
              <p className="text-gray-600 mb-4 text-lg">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and user experience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  'Google Analytics cookies to track page views and user behavior',
                  'Performance monitoring cookies',
                  'Error tracking cookies'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">3.3 Functional Cookies</h3>
              </div>
              <p className="text-gray-600 mb-4 text-lg">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  'Language preference cookies',
                  'Theme preference cookies',
                  'Filter preference cookies'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Third-Party Cookies Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">4. Third-Party Cookies</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements on and through the website, and so on.
          </p>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center mb-3">
                <BarChart3 className="h-6 w-6 text-amber-500 mr-3" />
                <h3 className="text-xl font-bold text-amber-800">4.1 Google Analytics</h3>
              </div>
              <p className="text-gray-700">
                We use Google Analytics to analyze the use of our website. Google Analytics gathers information about website use by means of cookies. The information gathered is used to create reports about the use of our website.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-3">
                <Eye className="h-6 w-6 text-purple-500 mr-3" />
                <h3 className="text-xl font-bold text-purple-800">4.2 Social Media Cookies</h3>
              </div>
              <p className="text-gray-700">
                Our website may include social media features, such as sharing buttons. These features may set cookies to enable the feature to function properly.
              </p>
            </div>
          </div>
        </div>

        {/* Cookie Duration Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">5. Cookie Duration</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            Cookies have different lifespans:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
              <div className="flex items-center mb-3">
                <Zap className="h-6 w-6 text-teal-500 mr-3" />
                <h4 className="font-bold text-teal-800">Session Cookies</h4>
              </div>
              <p className="text-gray-700">These cookies are temporary and are deleted when you close your browser.</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-center mb-3">
                <Lock className="h-6 w-6 text-indigo-500 mr-3" />
                <h4 className="font-bold text-indigo-800">Persistent Cookies</h4>
              </div>
              <p className="text-gray-700">These cookies remain on your device for a set period or until you delete them manually.</p>
            </div>
          </div>
        </div>

        {/* Managing Cookies Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">6. Managing Cookies</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
          </p>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                  <Monitor className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">6.1 Browser Settings</h3>
              </div>
              <p className="text-gray-600 mb-4 text-lg">
                Most web browsers allow you to manage cookies through their settings preferences. To learn more about how to manage cookies in your browser, visit:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <h3 className="text-2xl font-bold text-gray-900">6.2 Opt-Out Tools</h3>
              </div>
              <p className="text-gray-600 mb-4 text-lg">
                You can also opt out of certain types of cookies:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    {tool.name}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Impact of Disabling Cookies Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">7. Impact of Disabling Cookies</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            If you choose to disable cookies, some features of our website may not function properly. This may affect your ability to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Stay logged in to your account',
              'Remember your preferences and settings',
              'Use certain interactive features',
              'Receive personalized content'
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="text-gray-600 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Updates to Policy Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">8. Updates to This Policy</h2>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-gray-700 text-lg">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-12 border border-white/20 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">9. Contact Us</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              If you have any questions about our use of cookies, please contact us at:
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