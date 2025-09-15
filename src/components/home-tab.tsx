'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, User } from 'lucide-react';
import { CourseSchedule } from '@/types/schedule';
import { NotificationToggle } from './notification-toggle';

interface HomeTabProps {
  todaySchedules: CourseSchedule[];
  currentDay: string;
  getClassStatus: (schedule: CourseSchedule) => string;
  getStatusBadge: (schedule: CourseSchedule) => React.ReactNode;
  getCardStyling: (schedule: CourseSchedule, index: number) => string;
}

export function HomeTab({ 
  todaySchedules, 
  currentDay, 
  getClassStatus,
  getStatusBadge,
  getCardStyling 
}: HomeTabProps) {
  const nextClass = todaySchedules.find(schedule => 
    ['upcoming', 'today'].includes(getClassStatus(schedule))
  );

  const ongoingClass = todaySchedules.find(schedule => 
    getClassStatus(schedule) === 'ongoing'
  );

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {currentDay}
            </h2>
            <p className="text-blue-100">
              {todaySchedules.length} kelas hari ini
            </p>
          </div>
          <NotificationToggle />
        </div>

        {todaySchedules.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <p className="text-lg font-medium">
              Tidak ada jadwal hari ini
            </p>
            <p className="text-blue-100">
              Selamat beristirahat! 🎉
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {ongoingClass && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border-l-4 border-green-400 animate-pulse">
                <div className="flex items-center gap-2 text-green-300 text-sm mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Sedang Berlangsung</span>
                </div>
                <p className="text-lg font-medium mb-1">{ongoingClass.courseName}</p>
                <p className="text-blue-100">{ongoingClass.time} • {ongoingClass.room}</p>
              </div>
            )}
            
            {nextClass && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border-l-4 border-orange-400">
                <div className="flex items-center gap-2 text-orange-300 text-sm mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Kelas Berikutnya</span>
                </div>
                <p className="text-lg font-medium mb-1">{nextClass.courseName}</p>
                <p className="text-blue-100">{nextClass.time} • {nextClass.room}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Today's Schedule */}
      {todaySchedules.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Jadwal Hari Ini
          </h3>
          <div className="space-y-4">
            {todaySchedules.map((schedule, index) => (
              <Card
                key={schedule.id}
                className={`${getCardStyling(schedule, index)} hover:shadow-md transition-all duration-200`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {schedule.courseName}
                    </CardTitle>
                    <span className="text-xs font-medium text-gray-500 bg-white/60 px-2 py-1 rounded-full">
                      {schedule.credits} SKS
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 font-mono">
                      {schedule.courseCode} • {schedule.class}
                    </p>
                    {getStatusBadge(schedule)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{schedule.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{schedule.room}</span>
                  </div>
                  
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <User className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="leading-relaxed">{schedule.lecturer}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}