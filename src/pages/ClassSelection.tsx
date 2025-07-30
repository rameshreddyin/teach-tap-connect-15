import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ChevronRight, Users, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

// Teacher's current active class
const currentActiveClass = { id: '9A', name: 'Class 9A', students: 32, section: 'A', isActive: true };

// Classes assigned to the teacher
const assignedClasses = [
  { id: '9A', name: 'Class 9A', students: 32, section: 'A', isAssigned: true },
  { id: '10B', name: 'Class 10B', students: 25, section: 'B', isAssigned: true },
];

// All available classes 1-10
const allClasses = [
  { id: '1A', name: 'Class 1A', students: 25, section: 'A' },
  { id: '1B', name: 'Class 1B', students: 24, section: 'B' },
  { id: '2A', name: 'Class 2A', students: 26, section: 'A' },
  { id: '2B', name: 'Class 2B', students: 25, section: 'B' },
  { id: '3A', name: 'Class 3A', students: 28, section: 'A' },
  { id: '3B', name: 'Class 3B', students: 27, section: 'B' },
  { id: '4A', name: 'Class 4A', students: 29, section: 'A' },
  { id: '4B', name: 'Class 4B', students: 28, section: 'B' },
  { id: '5A', name: 'Class 5A', students: 30, section: 'A' },
  { id: '5B', name: 'Class 5B', students: 29, section: 'B' },
  { id: '6A', name: 'Class 6A', students: 31, section: 'A' },
  { id: '6B', name: 'Class 6B', students: 30, section: 'B' },
  { id: '7A', name: 'Class 7A', students: 32, section: 'A' },
  { id: '7B', name: 'Class 7B', students: 31, section: 'B' },
  { id: '8A', name: 'Class 8A', students: 33, section: 'A' },
  { id: '8B', name: 'Class 8B', students: 32, section: 'B' },
  { id: '9A', name: 'Class 9A', students: 32, section: 'A' },
  { id: '9B', name: 'Class 9B', students: 28, section: 'B' },
  { id: '10A', name: 'Class 10A', students: 30, section: 'A' },
  { id: '10B', name: 'Class 10B', students: 25, section: 'B' },
];

// Function to organize classes in the requested order
const organizeClasses = () => {
  const orderedClasses = [];
  
  // 1. Add current active class first (if exists)
  if (currentActiveClass) {
    orderedClasses.push({ ...currentActiveClass, category: 'active' });
  }
  
  // 2. Add assigned classes (excluding the active one if already added)
  assignedClasses.forEach(cls => {
    if (!currentActiveClass || cls.id !== currentActiveClass.id) {
      orderedClasses.push({ ...cls, category: 'assigned' });
    }
  });
  
  // 3. Add all other classes 1-10 in ascending order (excluding already added ones)
  const addedIds = orderedClasses.map(cls => cls.id);
  allClasses.forEach(cls => {
    if (!addedIds.includes(cls.id)) {
      orderedClasses.push({ ...cls, category: 'all' });
    }
  });
  
  return orderedClasses;
};

const sessions = [
  { id: 'morning', label: 'Morning', time: '8:00 AM - 12:00 PM', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '12:30 PM - 4:30 PM', icon: '🌞' },
];

const ClassSelection: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const navigate = useNavigate();
  const classes = organizeClasses();
  const isMobile = useIsMobile();

  const handleProceed = () => {
    if (selectedClass && selectedSession) {
      navigate(`/attendance?class=${selectedClass}&session=${selectedSession}`);
    }
  };

  return (
    <div className="page-container max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <GraduationCap size={isMobile ? 18 : 20} className="text-gray-800" />
          <h1 className="font-bold text-gray-800 text-xl md:text-2xl">Select Class & Session</h1>
        </div>
      </div>

      {/* Session Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Clock size={18} />
          Choose Session
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`cursor-pointer transition-all duration-200 border ${
                selectedSession === session.id
                  ? 'border-blue-400 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => setSelectedSession(session.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{session.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{session.label}</h3>
                      <p className="text-sm text-gray-600">{session.time}</p>
                    </div>
                  </div>
                  {selectedSession === session.id && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Class Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Users size={18} />
          Choose Class
        </h2>
        <div className="max-h-96 overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-1 gap-3">
            {classes.map((classItem) => (
              <Card
                key={classItem.id}
                className={`cursor-pointer transition-all duration-200 border ${
                  selectedClass === classItem.id
                    ? 'border-blue-400 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedClass(classItem.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                        classItem.category === 'active' 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                          : classItem.category === 'assigned'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : 'bg-gradient-to-br from-gray-500 to-gray-600'
                      }`}>
                        {classItem.section}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-800">{classItem.name}</h3>
                          {classItem.category === 'active' && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Active
                            </Badge>
                          )}
                          {classItem.category === 'assigned' && !classItem.isActive && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Assigned
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {classItem.students} students
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {selectedClass === classItem.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
        <div className="p-4 max-w-lg mx-auto">
          <Button
            className={`w-full h-12 font-medium transition-all ${
              selectedClass && selectedSession
                ? 'bg-black hover:bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleProceed}
            disabled={!selectedClass || !selectedSession}
          >
            <span>Proceed to Attendance</span>
            <ChevronRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClassSelection;