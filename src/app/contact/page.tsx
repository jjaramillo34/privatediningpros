'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Globe, MessageSquare, User, FileText, CheckCircle, ArrowRight, Building2, Calendar, Headphones } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactReason: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', contactReason: 'general' });
      setIsSubmitting(false);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1000);
  };

  const contactReasons = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'booking', label: 'Booking Assistance' },
    { value: 'restaurant', label: 'Restaurant Listing' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-8 shadow-2xl border border-white/30">
              <MessageSquare className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Have questions about private dining? We&apos;re here to help!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Message Sent Successfully!</h3>
                <p className="text-green-600">We&apos;ll get back to you within 24 hours.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Cards */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600 mb-3 text-sm">Call us during business hours</p>
            <a href="tel:+13472399026" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg">
              +1 (347) 239-9026
            </a>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 mb-3 text-sm">We&apos;ll respond within 24 hours</p>
            <a href="mailto:info@privatediningpros.com" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors break-all">
              info@privatediningpros.com
            </a>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600 mb-3 text-sm">Visit us in person</p>
            <p className="text-pink-600 font-semibold">
              368 9th Avenue<br />
              New York, NY 10001<br />
              Hell&apos;s Kitchen
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <Send className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Send us a Message</h2>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="contactReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Contact *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    id="contactReason"
                    name="contactReason"
                    value={formData.contactReason}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
                  >
                    {contactReasons.map(reason => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="What&apos;s this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                />
                <p className="text-xs text-gray-500 mt-2">Please provide as much detail as possible</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information & Map */}
          <div className="space-y-8">
            {/* Contact Info Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      368 9th Avenue<br />
                      New York, NY 10001<br />
                      Hell&apos;s Kitchen, Manhattan
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Phone</h3>
                    <a href="tel:+13472399026" className="text-gray-600 hover:text-purple-600 transition-colors">
                      +1 (347) 239-9026
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-pink-100 to-pink-200 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:info@privatediningpros.com" className="text-gray-600 hover:text-pink-600 transition-colors break-all">
                      info@privatediningpros.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mr-4">
                    <Globe className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Website</h3>
                    <a href="/" className="text-gray-600 hover:text-amber-600 transition-colors">
                      www.privatediningpros.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Business Hours</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Monday - Friday</span>
                  <span className="text-gray-600">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Saturday</span>
                  <span className="text-gray-600">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-900">Sunday</span>
                  <span className="text-gray-600 font-medium">Closed</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Response times may vary during weekends and holidays. We aim to respond to all inquiries within 24 business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg">
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about private dining
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'How do I book a private dining room?',
                answer: 'Contact the restaurant directly using the information provided on their listing. Each restaurant handles their own reservations and private dining bookings.',
                icon: Phone,
                color: 'from-blue-500 to-blue-600'
              },
              {
                question: 'What information do I need to provide?',
                answer: 'Be ready to share your party size, preferred date and time, occasion, and any special requirements or dietary restrictions.',
                icon: FileText,
                color: 'from-purple-500 to-purple-600'
              },
              {
                question: 'How far in advance should I book?',
                answer: 'We recommend booking at least 2-4 weeks in advance for private dining rooms, especially for weekends and special occasions.',
                icon: Calendar,
                color: 'from-pink-500 to-pink-600'
              },
              {
                question: 'Are there minimum spending requirements?',
                answer: 'Many restaurants have minimum spending requirements for private rooms. Contact the restaurant directly for their specific policies.',
                icon: Building2,
                color: 'from-emerald-500 to-emerald-600'
              },
              {
                question: 'Can I suggest a restaurant to be listed?',
                answer: 'Yes! Use our "Suggest a Restaurant" page to submit restaurants with private dining options. Our team will review and add them to our directory.',
                icon: Globe,
                color: 'from-amber-500 to-amber-600'
              },
              {
                question: 'Do you charge for restaurant listings?',
                answer: 'No, our service is free for both users and restaurants. We aim to provide comprehensive information about private dining options in NYC.',
                icon: CheckCircle,
                color: 'from-teal-500 to-teal-600'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all group">
                <div className="flex items-start mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${faq.color} rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <faq.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-gray-600 ml-13">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-white/20 shadow-xl">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Need More Help?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Check out our other resources or get in touch with our support team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/about"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors shadow-lg font-semibold"
              >
                About Us
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
              <a
                href="/suggest"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg font-semibold"
              >
                Suggest a Restaurant
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
