'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Heart, Mail, Lock, User, Phone, Calendar, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    // Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    
    // Role-specific fields
    licenseNumber: '',
    specialties: [] as string[],
    qualification: '',
    experience: '',
    department: '',
    shift: '',
    emergencyContact: '',
    bloodType: '',
    allergies: [] as string[],
    insurance: '',
    insuranceNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const roles = [
    {
      id: 'PATIENT',
      title: 'Patient',
      description: 'Book appointments, view medical records, and manage your health',
      icon: '👤',
      color: 'border-blue-200 bg-blue-50 text-blue-700',
      hoverColor: 'hover:border-blue-300 hover:bg-blue-100',
    },
    {
      id: 'DOCTOR',
      title: 'Doctor',
      description: 'Manage patients, schedules, and provide medical consultations',
      icon: '👨‍⚕️',
      color: 'border-green-200 bg-green-50 text-green-700',
      hoverColor: 'hover:border-green-300 hover:bg-green-100',
    },
    {
      id: 'NURSE',
      title: 'Nurse',
      description: 'Assist doctors, manage patient care and monitor vital signs',
      icon: '👩‍⚕️',
      color: 'border-purple-200 bg-purple-50 text-purple-700',
      hoverColor: 'hover:border-purple-300 hover:bg-purple-100',
    },
  ];

  const specialties = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Oncology',
    'Dermatology', 'Psychiatry', 'Radiology', 'Anesthesiology', 'Surgery',
    'Internal Medicine', 'Emergency Medicine', 'Ophthalmology', 'ENT',
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const shifts = ['Morning', 'Afternoon', 'Night', 'Rotating'];
  const departments = [
    'Emergency', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
    'Oncology', 'Surgery', 'ICU', 'General Ward', 'Maternity'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMultiSelect = (name: string, value: string) => {
    setFormData(prev => {
      const currentValue = prev[name as keyof typeof prev];
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [name]: currentValue.includes(value)
            ? currentValue.filter((item: string) => item !== value)
            : [...currentValue, value]
        };
      }
      return prev;
    });
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!selectedRole) {
        newErrors.role = 'Please select a role';
      }
    }

    if (currentStep === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (currentStep === 3 && selectedRole !== 'PATIENT') {
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'License number is required';
      }
      if (selectedRole === 'DOCTOR') {
        if (!formData.qualification.trim()) {
          newErrors.qualification = 'Qualification is required';
        }
        if (!formData.experience) {
          newErrors.experience = 'Experience is required';
        }
        if (formData.specialties.length === 0) {
          newErrors.specialties = 'Please select at least one specialty';
        }
      }
      if (selectedRole === 'NURSE') {
        if (!formData.department) {
          newErrors.department = 'Department is required';
        }
        if (!formData.shift) {
          newErrors.shift = 'Shift is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account created successfully!');
        router.push('/auth/signin?message=Please sign in with your new account');
      } else {
        toast.error(data.message || 'Registration failed');
        setErrors({ submit: data.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber <= step
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {stepNumber < step ? <CheckCircle className="w-5 h-5" /> : stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-12 h-px ${
                  stepNumber < step ? 'bg-red-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Role</h2>
        <p className="text-gray-600">Select how you&apos;ll be using our platform</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setSelectedRole(role.id)}
            className={`border-2 rounded-lg p-6 text-left transition-all ${
              selectedRole === role.id
                ? `${role.color} border-opacity-100`
                : `border-gray-200 hover:border-gray-300 ${role.hoverColor}`
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{role.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{role.description}</p>
              </div>
              {selectedRole === role.id && (
                <CheckCircle className="w-6 h-6 text-current" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      {errors.role && (
        <div className="text-red-600 text-sm flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{errors.role}</span>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="First name"
            />
          </div>
          {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Last name"
            />
          </div>
          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Create password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Your address"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    if (selectedRole === 'PATIENT') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Information</h2>
            <p className="text-gray-600">Help us provide better care (optional)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Emergency contact name and phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Type
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select blood type</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Provider
              </label>
              <input
                type="text"
                name="insurance"
                value={formData.insurance}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Insurance company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Number
              </label>
              <input
                type="text"
                name="insuranceNumber"
                value={formData.insuranceNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Policy/member number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Known Allergies
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Penicillin', 'Latex', 'Nuts', 'Shellfish', 'Aspirin', 'Other'].map((allergy) => (
                <label key={allergy} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.allergies.includes(allergy)}
                    onChange={() => handleMultiSelect('allergies', allergy)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{allergy}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Information</h2>
          <p className="text-gray-600">Your medical credentials and details</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Number *
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Professional license number"
          />
          {errors.licenseNumber && <p className="text-red-600 text-sm mt-1">{errors.licenseNumber}</p>}
        </div>

        {selectedRole === 'DOCTOR' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="MD, MBBS, etc."
                />
                {errors.qualification && <p className="text-red-600 text-sm mt-1">{errors.qualification}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Years"
                  min="0"
                />
                {errors.experience && <p className="text-red-600 text-sm mt-1">{errors.experience}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties * (Select at least one)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {specialties.map((specialty) => (
                  <label key={specialty} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() => handleMultiSelect('specialties', specialty)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>
              {errors.specialties && <p className="text-red-600 text-sm mt-1">{errors.specialties}</p>}
            </div>
          </>
        )}

        {selectedRole === 'NURSE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Shift *
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select shift</option>
                {shifts.map((shift) => (
                  <option key={shift} value={shift}>{shift}</option>
                ))}
              </select>
              {errors.shift && <p className="text-red-600 text-sm mt-1">{errors.shift}</p>}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="medical-gradient p-3 rounded-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thysia Medical</h1>
              <p className="text-sm text-gray-500">Healthcare Excellence</p>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-gray-600">
            Join our healthcare community and get access to world-class medical services
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          {renderStepIndicator()}

          {errors.submit && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Previous
                </button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Already have an account?
                </Link>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-medium transition-colors flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-red-600 hover:text-red-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-red-600 hover:text-red-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
