import { useState } from "react";
import {
  Phone, Mail, MapPin, Send, CheckCircle,
  MessageSquare, Headphones, BookOpen,
} from "lucide-react";

const FAQS = [
  {
    q: "Do I need any prior experience to enrol?",
    a: "No prior experience is required for our beginner courses. For intermediate and advanced programmes, relevant healthcare or administrative background is helpful but not mandatory.",
  },
  {
    q: "Are the certificates recognised by employers?",
    a: "Yes. Our certificates are recognised by all our partner HMOs and have been accepted by organisations including Hygeia, AIICO Multishield, Avon HMO, and Reliance HMO.",
  },
  {
    q: "Can I learn at my own pace?",
    a: "Absolutely. All courses are self-paced with lifetime access to recorded content. Live sessions are optional but highly recommended.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfers, Paystack, Flutterwave, and monthly installment plans for eligible courses.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes — if you are unsatisfied within the first 7 days of a course, we offer a full refund, no questions asked.",
  },
  {
    q: "How do I access the job board?",
    a: "The job board is available to all enrolled students immediately upon registration. It features new listings daily from our partner HMOs.",
  },
];

  const CONTACT_OPTIONS = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      detail: "+1 (555) 123-4567",
      sub: "Mon–Fri, 8am – 6pm EST",
      color: "bg-green-50 text-green-700",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      detail: "info@kalaroinstitute.com",
      sub: "We respond within 24 hours",
      color: "bg-blue-50 text-blue-700",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "WhatsApp",
      detail: "+1 (555) 123-4567",
      sub: "Quick responses on WhatsApp",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      detail: "Global Headquarters",
      sub: "Online Learning Platform",
      color: "bg-purple-50 text-purple-700",
    },
  ];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* Header */}
      <section className="bg-[#071a08] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 60%, #4caf50 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">We're Here to Help</h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm leading-relaxed">
            Have questions about a course, your career, or how Kalaro can help you? Our team is ready to assist.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTACT_OPTIONS.map((opt, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#f7faf7] rounded-2xl p-5 border border-gray-100">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${opt.color}`}>
                  {opt.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{opt.title}</p>
                  <p className="text-gray-700 text-sm font-medium mt-0.5">{opt.detail}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{opt.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + FAQs */}
      <section className="py-20 bg-[#f7faf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
              {!submitted ? (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Send Us a Message</h2>
                  <p className="text-gray-500 text-sm mb-8">Fill in the form and we'll get back to you within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="Your full name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address *</label>
                        <input
                          required
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                       <input
                           type="tel"
                           placeholder="+1 (555) 123-4567"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subject *</label>
                        <select
                          required
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors text-gray-700 bg-white"
                        >
                          <option value="">Select a subject</option>
                          <option>Course Enquiry</option>
                          <option>Career Consultation</option>
                          <option>Payment & Billing</option>
                          <option>Partnership</option>
                          <option>Technical Support</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us how we can help..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-green-200"
                    >
                      Send Message <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Message Sent!</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                    Thank you for reaching out. A member of our team will respond to you within 24 hours.
                  </p>
                </div>
              )}
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-500 text-sm mb-8">Quick answers to the questions we hear most often.</p>

              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                    >
                      <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${openFaq === i ? "bg-green-700 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {openFaq === i ? "−" : "+"}
                      </span>
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5">
                        <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Support options */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-green-700 text-white rounded-2xl p-5">
                  <Headphones className="w-7 h-7 mb-3 text-green-300" />
                  <p className="font-bold text-sm mb-1">Live Support</p>
                  <p className="text-green-200 text-xs">Mon–Fri, 8am–6pm EST</p>
                </div>
                <div className="bg-[#071a08] text-white rounded-2xl p-5">
                  <BookOpen className="w-7 h-7 mb-3 text-green-400" />
                  <p className="font-bold text-sm mb-1">Help Centre</p>
                  <p className="text-gray-400 text-xs">Browse 100+ help articles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="h-72 bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-[#f7faf7]">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-green-600 mx-auto mb-2" />
                   <p className="font-bold text-gray-700">Global Headquarters - Online Learning Platform</p>
            <p className="text-sm text-gray-400 mt-1">Open in Google Maps</p>
          </div>
        </div>
      </section>
    </div>
  );
}
