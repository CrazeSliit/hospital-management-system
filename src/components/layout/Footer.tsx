import Link from 'next/link';
import { Heart, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Doctors', href: '/doctors' },
    { name: 'Services', href: '/services' },
    { name: 'Appointments', href: '/appointments' },
    { name: 'Contact', href: '/contact' },
    { name: 'Emergency', href: '/emergency' },
  ];

  const services = [
    { name: 'General Medicine', href: '/services/general-medicine' },
    { name: 'Cardiology', href: '/services/cardiology' },
    { name: 'Pediatrics', href: '/services/pediatrics' },
    { name: 'Orthopedics', href: '/services/orthopedics' },
    { name: 'Gynecology', href: '/services/gynecology' },
    { name: 'Emergency Care', href: '/services/emergency' },
  ];

  const patientResources = [
    { name: 'Patient Portal', href: '/patient-portal' },
    { name: 'Medical Records', href: '/medical-records' },
    { name: 'Insurance Info', href: '/insurance' },
    { name: 'Billing', href: '/billing' },
    { name: 'Health Tips', href: '/health-tips' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hospital Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="medical-gradient p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Thysia Medical Center</h3>
                <p className="text-sm text-gray-400">Excellence in Healthcare</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Providing comprehensive healthcare services with a commitment to excellence, 
              compassion, and cutting-edge medical technology for over 20 years.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>123 Medical Street, Health City, HC 12345</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-red-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-red-500" />
                <span>info@thysia-medical.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="h-4 w-4 text-red-500" />
                <span>24/7 Emergency Services</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Medical Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Patient Resources</h3>
            <ul className="space-y-2">
              {patientResources.map((resource) => (
                <li key={resource.name}>
                  <Link
                    href={resource.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 Thysia Medical Center. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/hipaa-notice" className="hover:text-white transition-colors">
                HIPAA Notice
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-4 text-white">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span className="font-semibold">Emergency:</span>
              <span className="font-bold">911</span>
            </div>
            <div className="h-4 w-px bg-red-400"></div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Hospital:</span>
              <span className="font-bold">+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
