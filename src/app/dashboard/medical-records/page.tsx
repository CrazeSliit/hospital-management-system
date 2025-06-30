'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FileText, User, Activity, Heart, Thermometer, Weight, Eye, Plus } from 'lucide-react';

interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  notes?: string;
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    height: number;
  };
  prescriptions?: {
    id: string;
    medication: string;
    dosage: string;
    frequency: string;
  }[];
}

interface Vital {
  id?: string;
  patientId?: string;
  recordedAt?: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  recordedBy?: string;
}

export default function MedicalRecordsPage() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [vitals, setVitals] = useState<Vital | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchMedicalRecords();
    fetchVitals();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch('/api/medical-records');
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        setMedicalRecords(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setMedicalRecords([]); // Set to empty array on error
    } finally {
      setLoading(false);
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
      setVitals(null);
    }
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading medical records...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600">View your complete medical history and vital signs</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{(medicalRecords || []).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vitals Recorded</p>
                <p className="text-2xl font-bold text-gray-900">{vitals ? 1 : 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Heart Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vitals ? vitals.heartRate : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Thermometer className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Temperature</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vitals ? vitals.temperature : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Vitals */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Vital Signs</h2>
          </div>
          <div className="p-6">
            {!vitals ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No vitals recorded</p>
                <p className="text-gray-400">Visit your doctor to get your vitals recorded</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Latest Vitals</p>
                    <p className="text-xs text-gray-500">Recent</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm text-gray-700">Heart Rate</span>
                      </div>
                      <span className="text-sm font-medium">{vitals.heartRate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-700">Blood Pressure</span>
                      </div>
                      <span className="text-sm font-medium">{vitals.bloodPressure}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Thermometer className="h-4 w-4 text-orange-500 mr-2" />
                        <span className="text-sm text-gray-700">Temperature</span>
                      </div>
                      <span className="text-sm font-medium">{vitals.temperature}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Weight className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Weight</span>
                      </div>
                      <span className="text-sm font-medium">{vitals.weight}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Medical Records */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Medical History</h2>
          </div>
          <div className="p-6">
            {medicalRecords.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No medical records found</p>
                <p className="text-gray-400">Your medical history will appear here after your appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(medicalRecords || []).map((record) => (
                  <div key={record.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Dr. {record.doctorName}</h3>
                          <p className="text-sm text-gray-600">{record.date}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewRecord(record)}
                        className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Diagnosis</p>
                      <p className="text-sm text-gray-900">{record.diagnosis}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Symptoms</p>
                      <div className="flex flex-wrap gap-2">
                        {record.symptoms.map((symptom, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Treatment</p>
                      <p className="text-sm text-gray-900">{record.treatment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Medical Record Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Doctor</p>
                    <p className="text-gray-900">Dr. {selectedRecord.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date</p>
                    <p className="text-gray-900">{selectedRecord.date}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Diagnosis</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRecord.diagnosis}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecord.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Treatment</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRecord.treatment}</p>
                </div>

                {selectedRecord.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Additional Notes</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRecord.notes}</p>
                  </div>
                )}

                {selectedRecord.vitals && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Vital Signs</p>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600">Blood Pressure</p>
                        <p className="font-medium">{selectedRecord.vitals.bloodPressure}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Heart Rate</p>
                        <p className="font-medium">{selectedRecord.vitals.heartRate} BPM</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Temperature</p>
                        <p className="font-medium">{selectedRecord.vitals.temperature}°F</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Weight</p>
                        <p className="font-medium">{selectedRecord.vitals.weight} lbs</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Prescriptions</p>
                    <div className="space-y-2">
                      {selectedRecord.prescriptions.map((prescription) => (
                        <div key={prescription.id} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900">{prescription.medication}</p>
                          <p className="text-sm text-gray-600">
                            {prescription.dosage} - {prescription.frequency}
                          </p>
                        </div>
                      ))}
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
