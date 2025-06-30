'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Users, Shield, Phone, Play } from 'lucide-react';

export function Hero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const stats = [
    { icon: Users, label: 'Patients Served', value: '50,000+' },
    { icon: Calendar, label: 'Appointments Monthly', value: '5,000+' },
    { icon: Clock, label: 'Years of Excellence', value: '20+' },
    { icon: Shield, label: 'Success Rate', value: '98%' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="absolute inset-0 bg-white/60"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-red-100 rounded-full opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-red-200 rounded-full opacity-20"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-red-300 rounded-full opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                🩺 Welcome to Thysia Medical Center
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Health,{' '}
                <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience world-class healthcare with our team of expert doctors, 
                state-of-the-art facilities, and personalized patient care. Book your 
                appointment today and take the first step towards better health.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-gray-700 font-medium">Easy Online Booking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-gray-700 font-medium">24/7 Emergency Care</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-gray-700 font-medium">Expert Medical Team</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-gray-700 font-medium">Advanced Technology</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/auth/signup"
                className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
              >
                Book Appointment
              </Link>
              <Link
                href="/emergency"
                className="bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Emergency: 911</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-sm text-gray-500">
                ⭐ 4.9/5 rating from 10,000+ patients
              </div>
              <div className="text-sm text-gray-500">
                🏆 Accredited by Joint Commission
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image/Video */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              {!isVideoPlaying ? (
                <div className="relative">
                  <Image
                    src="/api/placeholder/600/400"
                    alt="Medical professionals at Thysia Medical Center"
                    width={600}
                    height={400}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors group"
                    >
                      <Play className="w-6 h-6 text-red-600 ml-1 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-500">
                    <Play className="w-16 h-16 mx-auto mb-4" />
                    <p>Virtual Tour Video</p>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/appointments/book"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Schedule Appointment</h3>
                <p className="text-sm text-gray-500">Book with your preferred doctor</p>
              </div>
            </div>
          </Link>

          <Link
            href="/doctors"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Find a Doctor</h3>
                <p className="text-sm text-gray-500">Browse our medical specialists</p>
              </div>
            </div>
          </Link>

          <Link
            href="/patient-portal"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Patient Portal</h3>
                <p className="text-sm text-gray-500">Access your medical records</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
