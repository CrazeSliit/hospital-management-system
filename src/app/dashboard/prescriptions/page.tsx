'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Pill, Clock, AlertCircle, CheckCircle, Plus } from 'lucide-react';

interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedDate: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'discontinued';
  refillsRemaining: number;
  totalRefills: number;
  notes?: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'discontinued'>('all');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions');
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        setPrescriptions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'discontinued':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPrescriptions = (prescriptions || []).filter(prescription => 
    filterStatus === 'all' || prescription.status === filterStatus
  );

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    return end < today;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading prescriptions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
            <p className="text-gray-600">Manage your medications and prescriptions</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Pill className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900">{(prescriptions || []).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(prescriptions || []).filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(prescriptions || []).filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(prescriptions || []).filter(p => isExpiringSoon(p.endDate)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Prescriptions
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'active'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('discontinued')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'discontinued'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Discontinued
            </button>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {filterStatus === 'all' ? 'All Prescriptions' : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Prescriptions`}
            </h2>
          </div>
          <div className="p-6">
            {filteredPrescriptions.length === 0 ? (
              <div className="text-center py-8">
                <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No prescriptions found</p>
                <p className="text-gray-400">Your prescriptions will appear here after your appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Pill className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{prescription.medication}</h3>
                          <p className="text-sm text-gray-600">Prescribed by Dr. {prescription.doctorName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {isExpiringSoon(prescription.endDate) && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Expiring Soon
                          </span>
                        )}
                        {isExpired(prescription.endDate) && prescription.status === 'active' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Expired
                          </span>
                        )}
                        <div className="flex items-center">
                          {getStatusIcon(prescription.status)}
                          <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                            {prescription.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dosage</p>
                        <p className="text-sm text-gray-900">{prescription.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Frequency</p>
                        <p className="text-sm text-gray-900">{prescription.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Duration</p>
                        <p className="text-sm text-gray-900">{prescription.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Refills</p>
                        <p className="text-sm text-gray-900">{prescription.refillsRemaining}/{prescription.totalRefills}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Start Date</p>
                        <p className="text-sm text-gray-900">{new Date(prescription.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">End Date</p>
                        <p className="text-sm text-gray-900">{new Date(prescription.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">Instructions</p>
                      <p className="text-sm text-gray-900">{prescription.instructions}</p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleViewPrescription(prescription)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedPrescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Prescription Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedPrescription.medication}</h4>
                  <div className="flex items-center">
                    {getStatusIcon(selectedPrescription.status)}
                    <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedPrescription.status)}`}>
                      {selectedPrescription.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Prescribed by</p>
                    <p className="text-gray-900">Dr. {selectedPrescription.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Prescribed Date</p>
                    <p className="text-gray-900">{new Date(selectedPrescription.prescribedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dosage</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedPrescription.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Frequency</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedPrescription.frequency}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Duration</p>
                    <p className="text-gray-900">{selectedPrescription.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Start Date</p>
                    <p className="text-gray-900">{new Date(selectedPrescription.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">End Date</p>
                    <p className="text-gray-900">{new Date(selectedPrescription.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Instructions</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedPrescription.instructions}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Refills Remaining</p>
                    <p className="text-gray-900">{selectedPrescription.refillsRemaining}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Refills</p>
                    <p className="text-gray-900">{selectedPrescription.totalRefills}</p>
                  </div>
                </div>

                {selectedPrescription.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Additional Notes</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedPrescription.notes}</p>
                  </div>
                )}

                {isExpiringSoon(selectedPrescription.endDate) && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-orange-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-orange-800">
                          Prescription Expiring Soon
                        </h3>
                        <p className="mt-1 text-sm text-orange-700">
                          This prescription will expire on {new Date(selectedPrescription.endDate).toLocaleDateString()}. 
                          Contact your doctor if you need a refill.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isExpired(selectedPrescription.endDate) && selectedPrescription.status === 'active' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Prescription Expired
                        </h3>
                        <p className="mt-1 text-sm text-red-700">
                          This prescription expired on {new Date(selectedPrescription.endDate).toLocaleDateString()}. 
                          Contact your doctor for a new prescription.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
