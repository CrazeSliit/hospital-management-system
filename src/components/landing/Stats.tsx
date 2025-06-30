'use client';

import { useState, useEffect, useMemo } from 'react';
import { Users, Calendar, Clock, Award, Heart, Stethoscope } from 'lucide-react';

export function Stats() {
  const [counters, setCounters] = useState({
    patients: 0,
    appointments: 0,
    doctors: 0,
    years: 0,
  });

  const stats = useMemo(() => [
    {
      icon: Users,
      label: 'Happy Patients',
      value: 50000,
      suffix: '+',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Calendar,
      label: 'Appointments Completed',
      value: 200000,
      suffix: '+',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Stethoscope,
      label: 'Expert Doctors',
      value: 150,
      suffix: '+',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Award,
      label: 'Years of Excellence',
      value: 20,
      suffix: '+',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ], []);

  const achievements = [
    {
      icon: Heart,
      title: 'Patient Satisfaction',
      value: '98%',
      description: 'Of patients rate our care as excellent',
    },
    {
      icon: Clock,
      title: 'Average Wait Time',
      value: '< 15 min',
      description: 'Efficient scheduling and prompt service',
    },
    {
      icon: Award,
      title: 'Success Rate',
      value: '99.2%',
      description: 'Successful treatment outcomes',
    },
  ];

  useEffect(() => {
    const animateCounters = () => {
      stats.forEach((stat, index) => {
        let current = 0;
        const increment = stat.value / 100;
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            current = stat.value;
            clearInterval(timer);
          }
          setCounters(prev => ({
            ...prev,
            [['patients', 'appointments', 'doctors', 'years'][index]]: Math.floor(current)
          }));
        }, 20);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, [stats]);

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-br from-red-600 to-red-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-10 left-1/3 w-16 h-16 border border-white rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
            📊 Our Impact in Numbers
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Thousands of Patients
          </h2>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            Over two decades of providing exceptional healthcare services with 
            measurable results and patient satisfaction.
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {Object.values(counters)[index].toLocaleString()}{stat.suffix}
              </div>
              <div className="text-red-100 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <achievement.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-2">{achievement.value}</div>
              <div className="text-lg font-semibold mb-2">{achievement.title}</div>
              <div className="text-red-100 text-sm">{achievement.description}</div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Join Our Community of Satisfied Patients
            </h3>
            <p className="text-red-100 mb-8 text-lg">
              Experience the difference that quality healthcare makes. 
              Book your appointment today and become part of our success story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-600 hover:bg-red-50 px-8 py-3 rounded-lg font-semibold transition-colors">
                Book Appointment
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
