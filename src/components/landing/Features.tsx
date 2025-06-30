import { Calendar, Clock, Video, Smartphone, Shield, Heart, Users, Stethoscope } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Online Booking',
      description: 'Schedule appointments with your preferred doctor at your convenience, 24/7.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Video,
      title: 'Telemedicine',
      description: 'Consult with doctors remotely through secure video calls from anywhere.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Access all services through our user-friendly mobile application.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Shield,
      title: 'Secure Records',
      description: 'Your medical data is protected with enterprise-grade security.',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Clock,
      title: '24/7 Emergency Care',
      description: 'Round-the-clock emergency services with immediate response.',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Heart,
      title: 'Personalized Care',
      description: 'Tailored treatment plans based on your unique health needs.',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Board-certified specialists with years of experience.',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: Stethoscope,
      title: 'Advanced Diagnostics',
      description: 'State-of-the-art medical equipment for accurate diagnosis.',
      color: 'bg-cyan-100 text-cyan-600',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
            ✨ Why Choose Thysia Medical
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Advanced Healthcare Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience modern healthcare with our comprehensive digital platform designed 
            to make your medical journey seamless and efficient.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience Better Healthcare?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Join thousands of satisfied patients who trust Thysia Medical Center 
              for their healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                Get Started Today
              </button>
              <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-8 py-3 rounded-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
