'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  Heart, 
  Menu, 
  X, 
  Calendar, 
  User, 
  Bell, 
  Settings, 
  LogOut,
  Home,
  Users,
  Stethoscope,
  FileText,
  CreditCard,
  Shield,
  Activity,
  MessageSquare
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Profile', href: '/dashboard/profile', icon: User },
      { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    switch (session?.user.role) {
      case 'PATIENT':
        return [
          ...baseItems.slice(0, 1),
          { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
          { name: 'Medical Records', href: '/dashboard/medical-records', icon: FileText },
          { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: FileText },
          { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
          { name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope },
          ...baseItems.slice(1),
        ];
      
      case 'DOCTOR':
        return [
          ...baseItems.slice(0, 1),
          { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
          { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
          { name: 'Patients', href: '/dashboard/patients', icon: Users },
          { name: 'Medical Records', href: '/dashboard/medical-records', icon: FileText },
          { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: FileText },
          { name: 'Reviews', href: '/dashboard/reviews', icon: MessageSquare },
          ...baseItems.slice(1),
        ];
      
      case 'NURSE':
        return [
          ...baseItems.slice(0, 1),
          { name: 'Assignments', href: '/dashboard/assignments', icon: Calendar },
          { name: 'Patients', href: '/dashboard/patients', icon: Users },
          { name: 'Vitals', href: '/dashboard/vitals', icon: Activity },
          { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
          ...baseItems.slice(1),
        ];
      
      case 'ADMIN':
        return [
          ...baseItems.slice(0, 1),
          { name: 'Users', href: '/dashboard/users', icon: Users },
          { name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope },
          { name: 'Nurses', href: '/dashboard/nurses', icon: Users },
          { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
          { name: 'Reports', href: '/dashboard/reports', icon: FileText },
          { name: 'System', href: '/dashboard/system', icon: Shield },
          ...baseItems.slice(1),
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'PATIENT':
        return 'bg-blue-100 text-blue-800';
      case 'DOCTOR':
        return 'bg-green-100 text-green-800';
      case 'NURSE':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="medical-gradient p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Thysia Medical</span>
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="text-gray-400 mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="medical-gradient p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Thysia Medical</span>
              </Link>
            </div>
            
            {/* User Info */}
            <div className="mt-6 px-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-medium text-sm">
                      {session?.user.firstName?.[0]}{session?.user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session?.user.firstName} {session?.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{session?.user.email}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(session?.user.role)}`}>
                    {session?.user.role}
                  </span>
                </div>
              </div>
            </div>

            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <item.icon className="text-gray-400 mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Sign Out Button */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <button
              onClick={() => signOut()}
              className="w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <LogOut className="text-gray-400 mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome back, {session?.user.firstName}!
              </h1>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <Link
                href="/dashboard/notifications"
                className="text-gray-400 hover:text-gray-500 relative p-2 rounded-full hover:bg-gray-100"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Link>
              
              {/* Quick Actions */}
              {session?.user.role === 'PATIENT' && (
                <Link
                  href="/appointments/book"
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Book Appointment
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
