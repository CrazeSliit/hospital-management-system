'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { User, Phone, Mail, MapPin, Calendar, Heart, AlertTriangle, Save, Edit } from 'lucide-react';

interface PatientProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: string;
  insurance: string;
  insuranceNumber: string;
}

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Mock data - in real app, this would be an API call
      const mockProfile: PatientProfile = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'patient.doe@email.com',
        phone: '+1-555-3001',
        dateOfBirth: '1990-12-05',
        address: '987 Patient Road, Health Town, HT 33333',
        emergencyContact: 'John Doe (Husband) - +1-555-3002',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Shellfish'],
        medicalHistory: 'Hypertension, managed with medication. No major surgeries.',
        insurance: 'Blue Cross Blue Shield',
        insuranceNumber: 'BCBS-123456789'
      };
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In real app, this would be an API call to save the profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof PatientProfile, value: string | string[]) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Profile not found</p>
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
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and medical details</p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{profile.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{profile.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="flex items-center px-3 py-2">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <div className="flex items-center px-3 py-2">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <div className="flex items-center px-3 py-2">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <div className="flex items-center px-3 py-2">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{profile.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Type
                  </label>
                  {isEditing ? (
                    <select
                      value={profile.bloodType}
                      onChange={(e) => handleInputChange('bloodType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <div className="flex items-center px-3 py-2">
                      <Heart className="h-4 w-4 text-red-400 mr-2" />
                      <span className="text-gray-900">{profile.bloodType}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.allergies.join(', ')}
                      onChange={(e) => handleInputChange('allergies', e.target.value.split(', '))}
                      placeholder="Separate allergies with commas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <div className="flex items-start px-3 py-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {profile.allergies.map((allergy, index) => (
                          <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical History
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profile.medicalHistory}
                      onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{profile.medicalHistory}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Summary & Emergency Contact */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-gray-600">Patient</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Born {new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>Blood Type: {profile.bloodType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <p className="text-gray-900">{profile.emergencyContact}</p>
              )}
            </div>

            {/* Insurance Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Provider</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.insurance}
                      onChange={(e) => handleInputChange('insurance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.insurance}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Policy Number</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.insuranceNumber}
                      onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-mono">{profile.insuranceNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
