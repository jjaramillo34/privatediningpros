import { FileText, CheckCircle, Shield, Users, AlertTriangle, Scale, Link, Copyright, Mail, MapPin, Phone, Calendar, Info, Lock, Globe, Gavel } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8 shadow-xl">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services
            </p>
            <div className="mt-8 inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="font-medium">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Acceptance of Terms Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">1. Acceptance of Terms</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-gray-700 text-lg">
                By accessing and using PrivateDiningPros (&quot;the Website&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </div>
        </div>

        {/* Description of Service Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">2. Description of Service</h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            PrivateDiningPros is a platform that provides information about restaurants with private dining rooms. We aggregate and display restaurant information, including contact details, private room specifications, and other relevant data to help users find suitable dining venues for their events.
          </p>
        </div>

        {/* User Accounts Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">3. User Accounts</h2>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-start">
                <Lock className="h-6 w-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-lg">
                  You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account, whether or not you have authorized such activities or actions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acceptable Use Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">4. Acceptable Use</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            You agree not to use the Website:
          </p>
          <div className="space-y-3">
            {[
              'In any way that violates any applicable federal, state, local, or international law or regulation',
              'To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation',
              'To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity',
              'To engage in any other conduct that restricts or inhibits anyone\'s use or enjoyment of the Website',
              'To introduce any viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful'
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-3 flex-shrink-0"></div>
                <span className="text-gray-600 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Intellectual Property Rights Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
              <Copyright className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">5. Intellectual Property Rights</h2>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-amber-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-gray-700 text-lg">
                The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by PrivateDiningPros, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            </div>
          </div>
        </div>

        {/* User Content Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">6. User Content</h2>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              You may have the opportunity to submit content to the Website. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in any and all media.
            </p>
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-violet-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-lg">
                  You represent and warrant that any content you submit is your original work or that you have the right to grant us the license described above.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimers Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl flex items-center justify-center mr-4">
              <Info className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">7. Disclaimers</h2>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              The information on this Website is provided &quot;as is&quot; without any representations or warranties, express or implied. PrivateDiningPros makes no representations or warranties in relation to this Website or the information and materials provided on this Website.
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-lg">
                  We do not guarantee the accuracy, completeness, or usefulness of any information on the Website. We are not responsible for any decisions made based on the information provided on the Website.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Limitation of Liability Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center mr-4">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">8. Limitation of Liability</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
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
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-3 flex-shrink-0"></div>
                <span className="text-gray-600 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Third-Party Links Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
              <Link className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">9. Third-Party Links</h2>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              The Website may contain links to third-party websites or services that are not owned or controlled by PrivateDiningPros. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-lg">
                  You acknowledge and agree that PrivateDiningPros shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Indemnification Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">10. Indemnification</h2>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-gray-700 text-lg">
                You agree to defend, indemnify, and hold harmless PrivateDiningPros and its licensors and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these Terms of Service or your use of the Website.
              </p>
            </div>
          </div>
        </div>

        {/* Governing Law Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mr-4">
              <Gavel className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">11. Governing Law</h2>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-start">
              <Scale className="h-6 w-6 text-purple-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-gray-700 text-lg">
                These Terms of Service and any dispute or claim arising out of or in connection with them or their subject matter or formation shall be governed by and construed in accordance with the laws of the State of New York, without giving effect to any choice or conflict of law provision or rule.
              </p>
            </div>
          </div>
        </div>

        {/* Changes to Terms Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">12. Changes to Terms</h2>
          </div>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-teal-500 mr-3 mt-1 flex-shrink-0" />
              <p className="text-gray-700 text-lg">
                We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-12 border border-white/20 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">13. Contact Information</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-blue-600 font-medium">legal@privatediningpros.com</p>
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