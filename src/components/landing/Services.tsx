import { Heart, Brain, Baby, Bone, UserX, Eye, Ear, Zap } from 'lucide-react';
import Link from 'next/link';

export function Services() {
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Comprehensive heart care including diagnostics, treatment, and prevention.',
      features: ['ECG & Echo', 'Cardiac Surgery', 'Heart Disease Prevention'],
      color: 'bg-red-50 border-red-200 text-red-600',
      link: '/services/cardiology',
    },
    {
      icon: Brain,
      title: 'Neurology',
      description: 'Advanced neurological care for brain and nervous system disorders.',
      features: ['Brain Imaging', 'Stroke Treatment', 'Neurological Surgery'],
      color: 'bg-purple-50 border-purple-200 text-purple-600',
      link: '/services/neurology',
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents.',
      features: ['Child Development', 'Vaccinations', 'Pediatric Surgery'],
      color: 'bg-pink-50 border-pink-200 text-pink-600',
      link: '/services/pediatrics',
    },
    {
      icon: Bone,
      title: 'Orthopedics',
      description: 'Treatment for bone, joint, and musculoskeletal conditions.',
      features: ['Joint Replacement', 'Sports Injuries', 'Spine Surgery'],
      color: 'bg-blue-50 border-blue-200 text-blue-600',
      link: '/services/orthopedics',
    },
    {
      icon: UserX,
      title: 'Oncology',
      description: 'Comprehensive cancer care with latest treatment technologies.',
      features: ['Chemotherapy', 'Radiation Therapy', 'Surgical Oncology'],
      color: 'bg-green-50 border-green-200 text-green-600',
      link: '/services/oncology',
    },
    {
      icon: Eye,
      title: 'Ophthalmology',
      description: 'Complete eye care including surgery and vision correction.',
      features: ['Cataract Surgery', 'LASIK', 'Retinal Treatment'],
      color: 'bg-cyan-50 border-cyan-200 text-cyan-600',
      link: '/services/ophthalmology',
    },
    {
      icon: Ear,
      title: 'ENT',
      description: 'Ear, nose, and throat treatments by experienced specialists.',
      features: ['Hearing Tests', 'Sinus Surgery', 'Voice Disorders'],
      color: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      link: '/services/ent',
    },
    {
      icon: Zap,
      title: 'Emergency Care',
      description: '24/7 emergency services with rapid response and critical care.',
      features: ['Trauma Care', 'Critical Care', 'Emergency Surgery'],
      color: 'bg-orange-50 border-orange-200 text-orange-600',
      link: '/services/emergency',
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
            🏥 Our Medical Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From routine check-ups to complex surgeries, we offer a full spectrum of 
            medical services delivered by board-certified specialists.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`border-2 ${service.color.split(' ')[1]} ${service.color.split(' ')[2]} rounded-xl p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 rounded-lg ${service.color.split(' ')[0]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className={`w-6 h-6 ${service.color.split(' ')[2]}`} />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-1 mb-4">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-xs text-gray-500 flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link
                href={service.link}
                className={`inline-flex items-center text-sm font-medium ${service.color.split(' ')[2]} hover:underline`}
              >
                Learn More →
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emergency Services */}
          <div className="bg-red-50 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Emergency</h3>
            <p className="text-gray-600 mb-4">
              Round-the-clock emergency care with immediate response and advanced life support.
            </p>
            <Link
              href="/emergency"
              className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition-colors inline-block"
            >
              Emergency Info
            </Link>
          </div>

          {/* Telemedicine */}
          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Telemedicine</h3>
            <p className="text-gray-600 mb-4">
              Virtual consultations with our doctors from the comfort of your home.
            </p>
            <Link
              href="/telemedicine"
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors inline-block"
            >
              Start Virtual Visit
            </Link>
          </div>

          {/* Health Checkups */}
          <div className="bg-green-50 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Health Checkups</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive health screening packages for early detection and prevention.
            </p>
            <Link
              href="/health-checkups"
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition-colors inline-block"
            >
              Book Checkup
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
