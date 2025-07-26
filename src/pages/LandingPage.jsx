import React, { useState } from "react";
import {
  MessageSquare,
  FileText,
  CheckCircle,
  Users,
  Play,
  Clock,
  ArrowRight,
  Menu,
  X,
  Star,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const featureCards = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Centralized Assets",
      description:
        "Keep all your design files, documents, and images organized in one secure place, categorized by project.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Contextual Feedback",
      description:
        "Enable clients to leave specific comments directly on designs, eliminating confusion and miscommunication.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Progress Tracking",
      description:
        "Monitor implementation status in real-time and keep stakeholders updated on completed and pending changes.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Client Management",
      description:
        "Efficiently manage multiple clients and projects with privacy controls ensuring clients only see their own projects.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Faster Approvals",
      description:
        "Streamline review cycles and reduce project completion time with clear feedback processes.",
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Interactive Presentations",
      description:
        "Present your designs in context with interactive elements that showcase functionality.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Creative Director",
      company: "DesignCo",
      content:
        "Rivong has transformed how we collaborate with clients. The feedback process is now seamless and efficient.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Project Manager",
      company: "TechStart",
      content:
        "The centralized asset management and real-time progress tracking have saved us countless hours.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "InnovateLab",
      content:
        "Client presentations have never been more interactive and engaging. Our approval rates increased by 40%.",
      rating: 5,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Bar */}
      <header className="fixed w-full bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-yellow-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <Link to="/" className="text-white text-xl font-bold">
                  <span className="text-2xl font-bold text-yellow-600">
                    Rivong
                  </span>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
              >
                About
              </a>
            </nav>

            <div className="flex items-center gap-x-4 md:gap-x-6">
              {isAuthenticated ? (
                <button className="rounded-xl bg-gradient-to-r bg-yellow-600 px-6 py-3 text-sm font-medium text-white hover:shadow-lg hover:scale-105 transition-all duration-200">
                  Dashboard
                </button>
              ) : (
                <>
                  <Link to="/login" className="hidden md:block text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" className="rounded-xl bg-gradient-to-r bg-black px-6 py-3 text-sm font-medium text-white hover:shadow-lg hover:scale-105 transition-all duration-200">
                    Sign up
                  </Link>
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
                >
                  Testimonials
                </a>
                <a
                  href="#about"
                  className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
                >
                  About
                </a>
                <button className="w-full text-left text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors">
                  Log in
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-16 md:pb-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Streamline Your Creative Process
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Welcome to{" "}
                <span className="text-yellow-600">
                  Rivong Feedback
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Your dedicated space for seamless design and content
                collaboration. Share your vision, provide precise feedback, and
                watch your creative projects come to life with unprecedented
                clarity and efficiency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group rounded-xl bg-black px-8 py-4 text-lg font-medium text-white hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* <div className="mt-12 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Secure & Private
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Cloud-Based
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Team Collaboration
                </div>
              </div> */}
            </div>

            <div className="relative">
              <div className="relative rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">R</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        Rivong Dashboard
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="h-20 bg-yellow-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-yellow-600" />
                      </div>
                      <div className="h-20 bg-purple-50 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Empowering Clients with{" "}
              <span className="text-yellow-600">
                Rivong Feedback
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Experience a new level of clarity and efficiency in your creative
              projects. Rivong Feedback puts you in control, ensuring your
              vision is realized with precision and speed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-16 md:py-24 bg-yellow-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Creative Teams Worldwide
            </h2>
            <p className="text-lg text-gray-600">
              See what our users have to say about their experience with Rivong
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Creative Process?
            </h2>
            <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creative professionals who have streamlined
              their workflow with Rivong
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group rounded-xl bg-white px-8 py-4 text-lg font-medium text-yellow-600 hover:bg-gray-50 hover:scale-105 transition-all duration-300 flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-yellow-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-2xl font-bold text-yellow-400">
                  Rivong
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering creative teams with seamless collaboration and
                feedback tools.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white transition-colors cursor-pointer">
                  Features
                </div>
                <div className="hover:text-white transition-colors cursor-pointer">
                  Pricing
                </div>
                <div className="hover:text-white transition-colors cursor-pointer">
                  Security
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white transition-colors cursor-pointer">
                  About
                </div>
                <div className="hover:text-white transition-colors cursor-pointer">
                  Contact
                </div>
                <div className="hover:text-white transition-colors cursor-pointer">
                  Privacy
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rivong. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
