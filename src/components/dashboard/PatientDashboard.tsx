'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, User, FileText, Heart, Bell, CreditCard, Video } from 'lucide-react';

interface Appointment {
  id: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface Prescription {
  id: string;
  doctorName: string;
  medications: string[];
  date: string;
  status: 'active' | 'completed';
}

export default function PatientDashboard() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [vitals, setVitals] = useState({
    bloodPressure: '120/80',
    heartRate: '72 bpm',
    temperature: '98.6°F',
    weight: '70 kg'
  });

  useEffect(() => {
    // Fetch patient data
    fetchAppointments();
    fetchPrescriptions();
    fetchVitals();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions');
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const fetchVitals = async () => {
    try {
      const response = await fetch('/api/vitals');
      if (response.ok) {
        const data = await response.json();
        setVitals(data);
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name}
        </h1>
        <p className="text-gray-600">
          Here&apos;s an overview of your health information and upcoming appointments.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'upcoming').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Heart Rate</p>
              <p className="text-2xl font-bold text-gray-900">{vitals.heartRate}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
          </div>
          <div className="p-6">
            {appointments.filter(a => a.status === 'upcoming').length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {appointments.filter(a => a.status === 'upcoming').slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400" />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                        <p className="text-sm text-gray-600">{appointment.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                      <p className="text-sm text-gray-600">{appointment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Book New Appointment
            </button>
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Prescriptions</h2>
          </div>
          <div className="p-6">
            {prescriptions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No prescriptions found</p>
            ) : (
              <div className="space-y-4">
                {prescriptions.slice(0, 3).map((prescription) => (
                  <div key={prescription.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">Dr. {prescription.doctorName}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {prescription.medications.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500">{prescription.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
            <Calendar className="h-5 w-5 mr-2" />
            Book Appointment
          </button>
          <button className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
            <Video className="h-5 w-5 mr-2" />
            Telemedicine
          </button>
          <button className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
            <FileText className="h-5 w-5 mr-2" />
            Medical Records
          </button>
          <button className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
            <CreditCard className="h-5 w-5 mr-2" />
            Pay Bills
          </button>
        </div>
      </div>

      {/* Health Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Blood Pressure</p>
            <p className="text-xl font-bold text-gray-900">{vitals.bloodPressure}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Heart Rate</p>
            <p className="text-xl font-bold text-gray-900">{vitals.heartRate}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="text-xl font-bold text-gray-900">{vitals.temperature}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Weight</p>
            <p className="text-xl font-bold text-gray-900">{vitals.weight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
