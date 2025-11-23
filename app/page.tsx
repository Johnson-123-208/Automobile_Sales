"use client";
import React, { useState, useEffect } from 'react';
import { Car, Wrench, TrendingUp, Users, Shield, Zap, ArrowRight, Menu, X, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Car,
      title: "Premium Vehicles",
      description: "Wide range of cars, bikes, autos, and scooties from top brands"
    },
    {
      icon: Wrench,
      title: "Genuine Spare Parts",
      description: "Authentic spare parts with compatibility matching for all models"
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description: "Competitive pricing with transparent deals and financing options"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Experienced sales professionals ready to assist you"
    },
    {
      icon: Shield,
      title: "Warranty & Support",
      description: "Comprehensive warranty coverage and after-sales service"
    },
    {
      icon: Zap,
      title: "Quick Delivery",
      description: "Fast processing and delivery for vehicles and spare parts"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ease-in-out ${
        isScrolled ? 'bg-slate-950/98 backdrop-blur-2xl shadow-2xl py-3 border-b border-slate-800/50' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <Car className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" size={36} />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                JEN Automobiles
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/automobiles" className="text-slate-300 hover:text-indigo-400 transition-all duration-300 font-medium relative group">
                Vehicles
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/spare-parts" className="text-slate-300 hover:text-indigo-400 transition-all duration-300 font-medium relative group">
                Spare Parts
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/favorites" className="text-slate-300 hover:text-indigo-400 transition-all duration-300 font-medium relative group">
                <Heart className="inline mr-1" size={18} />
                Favorites
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="/login?role=admin" 
                className="px-4 py-2 text-slate-300 hover:text-indigo-400 transition-all duration-300 font-medium"
              >
                Admin Login
              </Link>
              <Link 
                href="/login?role=employee" 
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-indigo-500/50 transform hover:scale-105"
              >
                Employee Login
              </Link>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t">
            <div className="px-6 py-4 space-y-4">
              <Link href="/automobiles" className="block text-white hover:text-red-500 transition-colors">
                Vehicles
              </Link>
              <Link href="/spare-parts" className="block text-white hover:text-red-500 transition-colors">
                Spare Parts
              </Link>
              <Link href="/login?role=admin" className="block text-white hover:text-red-500 transition-colors">
                Admin Login
              </Link>
              <Link href="/login?role=employee" className="block w-full text-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all">
                Employee Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-950 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20 text-center px-6 max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Drive Your Dreams
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
              Premium Automobiles & Parts
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner for quality vehicles and genuine spare parts. 
            Experience excellence in every ride.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/automobiles"
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-lg font-semibold shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Browse Vehicles</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/spare-parts"
              className="px-10 py-4 border-2 border-indigo-400/50 text-white rounded-xl hover:bg-indigo-500/20 hover:border-indigo-400 text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              Shop Spare Parts
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        >
          <ArrowRight className="text-white rotate-90" size={24} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <feature.icon className="text-indigo-400 mb-4 transition-transform duration-300 group-hover:scale-110" size={48} />
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Browse our extensive collection of vehicles and spare parts today
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/automobiles"
                className="px-10 py-4 bg-white text-indigo-600 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                View Vehicles
              </Link>
              <Link
                href="/spare-parts"
                className="px-10 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 backdrop-blur-sm text-lg font-semibold transition-all duration-300"
              >
                Explore Parts
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Car className="text-indigo-400" size={32} />
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  JEN Automobiles
                </span>
              </div>
              <p className="text-slate-400">
                Your trusted partner for premium automobiles and genuine spare parts.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/automobiles" className="block text-slate-400 hover:text-indigo-400 transition-colors duration-300">
                  Vehicles
                </Link>
                <Link href="/spare-parts" className="block text-slate-400 hover:text-indigo-400 transition-colors duration-300">
                  Spare Parts
                </Link>
                <Link href="/login" className="block text-slate-400 hover:text-indigo-400 transition-colors duration-300">
                  Employee Portal
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <p className="text-slate-400">Email: info@jenautomobiles.com</p>
              <p className="text-slate-400">Phone: +91 XXX XXX XXXX</p>
            </div>
          </div>
          <div className="border-t border-slate-800/50 pt-8 text-center text-slate-400">
            <p>© 2025 JEN Automobiles. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
