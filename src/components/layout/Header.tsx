'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Heart, LogOut, Calendar, Bell, LayoutDashboard } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '#services' },
    { name: 'Doctors', href: '/doctors' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '#contact' },
  ];

  const getNavigationWithDashboard = () => {
    if (session) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Services', href: '#services' },
        { name: 'Doctors', href: '/doctors' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '#contact' },
      ];
    }
    return navigation;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="medical-gradient p-2 rounded-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Thysia Medical</h1>
                <p className="text-xs text-gray-500">Healthcare Excellence</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {getNavigationWithDashboard().map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.name === 'Dashboard' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/dashboard/appointments"
                  className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Appointments"
                >
                  <Calendar className="h-5 w-5" />
                </Link>
                <Link
                  href="/notifications"
                  className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-medium text-sm">
                      {session.user.firstName?.[0]}{session.user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {session.user.firstName} {session.user.lastName}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {session.user.role?.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-600 hover:text-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-red-600 p-2 rounded-md"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {getNavigationWithDashboard().map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    item.name === 'Dashboard' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                {session ? (
                  <div className="space-y-1">
                    <Link
                      href="/dashboard"
                      className="bg-red-600 text-white hover:bg-red-700 flex items-center px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/appointments"
                      className="text-gray-600 hover:text-red-600 flex items-center px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Appointments
                    </Link>
                    <div className="px-3 py-2">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        {session.user.firstName} {session.user.lastName}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {session.user.role?.toLowerCase()}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-600 hover:text-red-600 flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href="/auth/signin"
                      className="text-gray-600 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-red-600 text-white hover:bg-red-700 block px-3 py-2 rounded-md text-base font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
