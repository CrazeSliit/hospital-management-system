'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Mother of Two',
      image: '/api/placeholder/100/100',
      rating: 5,
      text: 'The care my family received at Thysia Medical Center was exceptional. The doctors were thorough, compassionate, and took time to explain everything. The online booking system made scheduling so easy!',
      treatment: 'Family Medicine',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Business Executive',
      image: '/api/placeholder/100/100',
      rating: 5,
      text: 'After my heart surgery, the cardiac team provided outstanding follow-up care. The telemedicine consultations were incredibly convenient for my busy schedule. Highly recommend!',
      treatment: 'Cardiology',
    },
    {
      name: 'Emily Chen',
      role: 'College Student',
      image: '/api/placeholder/100/100',
      rating: 5,
      text: 'The pediatric team took amazing care of my little brother. They made him feel comfortable and explained everything in a way he could understand. The staff is truly wonderful.',
      treatment: 'Pediatrics',
    },
    {
      name: 'David Thompson',
      role: 'Retired Teacher',
      image: '/api/placeholder/100/100',
      rating: 5,
      text: 'From emergency care to ongoing treatment, Thysia Medical Center has been my healthcare home for 10 years. The quality of care and attention to detail is unmatched.',
      treatment: 'General Medicine',
    },
    {
      name: 'Lisa Park',
      role: 'Working Mother',
      image: '/api/placeholder/100/100',
      rating: 5,
      text: 'The maternity care was incredible. The staff supported me through every step of my pregnancy and delivery. The facilities are modern and the care is personalized.',
      treatment: 'Maternity Care',
    },
    {
      name: 'James Wilson',
      role: 'Construction Worker',
      image: '/api/placeholder/100/100',
      rating: 5,
      text: 'After my work injury, the orthopedic team got me back on my feet quickly. The physical therapy program was excellent and the staff was encouraging throughout my recovery.',
      treatment: 'Orthopedics',
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
            💬 Patient Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from real patients who have experienced our commitment 
            to excellent healthcare and compassionate service.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8 max-w-4xl mx-auto">
          <div className="absolute top-6 left-6 text-red-200">
            <Quote className="w-12 h-12" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600">
                  {testimonials[currentTestimonial].name[0]}
                </span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonials[currentTestimonial].text}&rdquo;
              </blockquote>
              
              <div>
                <cite className="text-lg font-semibold text-gray-900 not-italic">
                  {testimonials[currentTestimonial].name}
                </cite>
                <div className="text-gray-500">{testimonials[currentTestimonial].role}</div>
                <div className="text-sm text-red-600 font-medium">
                  {testimonials[currentTestimonial].treatment}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center space-x-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentTestimonial ? 'bg-red-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Grid of Mini Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-red-600">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {testimonial.text.length > 120 
                  ? `${testimonial.text.substring(0, 120)}...` 
                  : testimonial.text
                }
              </p>
              <div className="mt-3 text-xs text-red-600 font-medium">
                {testimonial.treatment}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience Our Exceptional Care?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Join thousands of satisfied patients who trust us with their health. 
              Schedule your appointment today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                Book Your Appointment
              </button>
              <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-8 py-3 rounded-lg font-semibold transition-colors">
                View All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
