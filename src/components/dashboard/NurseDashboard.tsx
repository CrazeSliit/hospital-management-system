'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Bed, AlertTriangle, Clock, Activity, Thermometer, Heart, Shield } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  roomNumber: string;
  condition: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  vitals: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    oxygenSaturation: string;
  };
  lastCheckup: string;
  medications: string[];
}

interface Task {
  id: string;
  patientName: string;
  task: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export default function NurseDashboard() {
  const { data: session } = useSession();
  const [assignedPatients, setAssignedPatients] = useState<Patient[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    criticalPatients: 0,
    pendingTasks: 0,
    completedTasks: 0
  });

  useEffect(() => {
    fetchAssignedPatients();
    fetchTasks();
    fetchStats();
  }, []);

  const fetchAssignedPatients = async () => {
    try {
      const response = await fetch('/api/nurse/patients');
      if (response.ok) {
        const data = await response.json();
        setAssignedPatients(data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/nurse/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/nurse/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const response = await fetch(`/api/nurse/tasks/${taskId}/toggle`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Good morning, Nurse {session?.user?.name}
        </h1>
        <p className="text-gray-600">
          You have {assignedPatients.length} patients assigned and {tasks.filter(t => !t.completed).length} pending tasks.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assigned Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.criticalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Assigned Patients</h2>
          </div>
          <div className="p-6">
            {assignedPatients.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No patients assigned</p>
            ) : (
              <div className="space-y-4">
                {assignedPatients.map((patient) => (
                  <div key={patient.id} className={`border rounded-lg p-4 ${getPriorityColor(patient.priority)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Bed className="h-5 w-5 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-600">Room {patient.roomNumber} • {patient.condition}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(patient.priority)}`}>
                        {patient.priority}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center">
                        <Thermometer className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">{patient.vitals.temperature}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">{patient.vitals.heartRate}</span>
                      </div>
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">{patient.vitals.bloodPressure}</span>
                      </div>
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm">{patient.vitals.oxygenSaturation}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Last checkup: {patient.lastCheckup}
                    </div>
                    
                    {patient.medications.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Medications:</p>
                        <p className="text-xs text-gray-600">{patient.medications.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Tasks</h2>
          </div>
          <div className="p-6">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks for today</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className={`flex items-center p-3 rounded-lg border ${
                    task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="mr-3 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.task}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.patientName} • {task.time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
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
            <Thermometer className="h-5 w-5 mr-2" />
            Record Vitals
          </button>
          <button className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
            <Clock className="h-5 w-5 mr-2" />
            Medication Schedule
          </button>
          <button className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Emergency Alert
          </button>
          <button className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
            <Users className="h-5 w-5 mr-2" />
            Patient Rounds
          </button>
        </div>
      </div>

      {/* Critical Alerts */}
      {assignedPatients.filter(p => p.priority === 'critical').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-red-900">Critical Alerts</h2>
          </div>
          <div className="space-y-3">
            {assignedPatients.filter(p => p.priority === 'critical').map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-600">Room {patient.roomNumber} • {patient.condition}</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
