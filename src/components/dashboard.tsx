'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, User, Filter, X, Bell, PlayCircle, Grid3X3, CalendarDays, BookOpen, TrendingUp } from 'lucide-react';
import { CourseSchedule, FilterOptions } from '@/types/schedule';
import { courseSchedules, lecturers, days } from '@/data/sample-data';
import { scheduleClassNotification } from '@/lib/notification';
import { HomeTab } from './home-tab';
import { SettingsTab } from './settings-tab';
import { BottomNav } from './bottom-nav';

const pastelColors = [
  'bg-blue-50 border-blue-200',
  'bg-green-50 border-green-200',
  'bg-purple-50 border-purple-200',
  'bg-orange-50 border-orange-200',
  'bg-pink-50 border-pink-200',
  'bg-yellow-50 border-yellow-200',
  'bg-teal-50 border-teal-200',
];

// Utility functions for time handling
const getCurrentDay = () => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[new Date().getDay()];
};

const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes(); // Convert to minutes since midnight
};

const parseTime = (timeString: string) => {
  const [startTime] = timeString.split('-');
  const [hours, minutes] = startTime.split(':').map(Number);
  return hours * 60 + minutes;
};

const getClassStatus = (schedule: CourseSchedule) => {
  const currentDay = getCurrentDay();
  const currentTime = getCurrentTime();
  const classTime = parseTime(schedule.time);
  const classEndTime = parseTime(schedule.time.split('-')[1]);

  if (schedule.day !== currentDay) {
    return 'not-today';
  }

  if (currentTime < classTime) {
    const minutesUntil = classTime - currentTime;
    if (minutesUntil <= 30) {
      return 'upcoming';
    }
    return 'today';
  } else if (currentTime >= classTime && currentTime <= classEndTime) {
    return 'ongoing';
  } else {
    return 'finished';
  }
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [schedules] = useState<CourseSchedule[]>(courseSchedules);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('cards');

  // Update time and schedule notifications
  useEffect(() => {
    // Schedule notifications for today's classes
    const scheduleNotifications = () => {
      const today = getCurrentDay();
      const todaySchedules = schedules.filter(schedule => schedule.day === today);
      
      todaySchedules.forEach(schedule => {
        scheduleClassNotification(
          schedule.courseName,
          schedule.time,
          schedule.room,
          15 // 15 minutes before class
        );
      });
    };

    // Initial scheduling
    scheduleNotifications();

    // Reschedule at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const midnightTimer = setTimeout(() => {
      scheduleNotifications();
      // Set up daily scheduling
      setInterval(scheduleNotifications, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    return () => {
      clearTimeout(midnightTimer);
    };
  }, [schedules]);

  const filteredSchedules = schedules.filter(schedule => {
    const matchesDay = !filters.day || schedule.day === filters.day;
    const matchesLecturer = !filters.lecturer || schedule.lecturer === filters.lecturer;
    const matchesSearch = !searchTerm || 
      schedule.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDay && matchesLecturer && matchesSearch;
  });

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const getPastelColor = (index: number) => {
    return pastelColors[index % pastelColors.length];
  };

  const getCardStyling = (schedule: CourseSchedule, index: number) => {
    const status = getClassStatus(schedule);
    const baseColor = getPastelColor(index);
    
    switch (status) {
      case 'ongoing':
        return `${baseColor} ring-2 ring-green-400 shadow-lg animate-pulse`;
      case 'upcoming':
        return `${baseColor} ring-2 ring-orange-400 shadow-lg`;
      case 'today':
        return `${baseColor} ring-1 ring-blue-300`;
      case 'finished':
        return `${baseColor} opacity-75`;
      default:
        return baseColor;
    }
  };

  const getStatusBadge = (schedule: CourseSchedule) => {
    const status = getClassStatus(schedule);
    
    switch (status) {
      case 'ongoing':
        return (
          <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <PlayCircle className="h-3 w-3" />
            Sedang Berlangsung
          </div>
        );
      case 'upcoming':
        const currentTime = getCurrentTime();
        const classTime = parseTime(schedule.time);
        const minutesUntil = classTime - currentTime;
        return (
          <div className="flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
            <Bell className="h-3 w-3" />
            {minutesUntil} menit lagi
          </div>
        );
      case 'today':
        return (
          <div className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
            Hari Ini
          </div>
        );
      case 'finished':
        return (
          <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Selesai
          </div>
        );
      default:
        return null;
    }
  };

  // Calendar view utilities
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const getScheduleForDayAndTime = (day: string, timeSlot: string) => {
    return filteredSchedules.find(schedule => {
      const startTime = schedule.time.split('-')[0];
      const [scheduleHour] = startTime.split(':').map(Number);
      const [slotHour] = timeSlot.split(':').map(Number);
      
      return schedule.day === day && scheduleHour === slotHour;
    });
  };

  const getClassDuration = (timeString: string) => {
    const [start, end] = timeString.split('-');
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return (endMinutes - startMinutes) / 60; // Duration in hours
  };

  // Statistics calculations
  const getStatistics = () => {
    const totalSKS = schedules.reduce((sum, schedule) => sum + schedule.credits, 0);
    const totalClasses = schedules.length;
    
    // Classes per day distribution
    const classesPerDay = weekDays.reduce((acc, day) => {
      acc[day] = schedules.filter(s => s.day === day).length;
      return acc;
    }, {} as Record<string, number>);
    
    // Busiest day
    const busiestDay = Object.entries(classesPerDay).reduce((max, [day, count]) => 
      count > max.count ? { day, count } : max, { day: '', count: 0 });
    
    // Average class duration
    const totalDuration = schedules.reduce((sum, schedule) => sum + getClassDuration(schedule.time), 0);
    const avgDuration = totalDuration / totalClasses;
    
    // Time distribution (morning, afternoon, evening)
    const timeDistribution = schedules.reduce((acc, schedule) => {
      const startTime = parseTime(schedule.time);
      if (startTime < 12 * 60) acc.morning++;
      else if (startTime < 17 * 60) acc.afternoon++;
      else acc.evening++;
      return acc;
    }, { morning: 0, afternoon: 0, evening: 0 });
    
    return {
      totalSKS,
      totalClasses,
      classesPerDay,
      busiestDay,
      avgDuration,
      timeDistribution
    };
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            todaySchedules={schedules.filter(schedule => schedule.day === getCurrentDay())}
            currentDay={getCurrentDay()}
            getClassStatus={getClassStatus}
            getStatusBadge={getStatusBadge}
            getCardStyling={getCardStyling}
          />
        );
      case 'schedule':
        return (
          <>
            {/* View Toggle & Filters */}
            <Card className="mb-8 rounded-2xl shadow-sm border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Filter Section */}
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Filter className="h-5 w-5 text-gray-500" />
                      <span className="font-medium text-gray-700">Filter:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <Select
                        value={filters.day || 'all'}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, day: value === 'all' ? undefined : value }))}
                      >
                        <SelectTrigger className="w-full rounded-xl border-gray-200">
                          <SelectValue placeholder="Hari" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Hari</SelectItem>
                          {days.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={filters.lecturer || 'all'}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, lecturer: value === 'all' ? undefined : value }))}
                      >
                        <SelectTrigger className="w-full rounded-xl border-gray-200">
                          <SelectValue placeholder="Dosen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Dosen</SelectItem>
                          {lecturers.map(lecturer => (
                            <SelectItem key={lecturer} value={lecturer}>
                              {lecturer.length > 30 ? `${lecturer.substring(0, 30)}...` : lecturer}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Cari mata kuliah..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border-gray-200"
                      />

                      {(filters.day || filters.lecturer || searchTerm) && (
                        <Button
                          variant="outline"
                          size="default"
                          onClick={clearFilters}
                          className="w-full rounded-xl border-gray-200 h-10"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* View Toggle Section */}
                  <div className="flex justify-center sm:justify-end mt-2">
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                      <Button
                        variant={viewMode === 'cards' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('cards')}
                        className="rounded-md flex-1 sm:flex-none min-w-[100px]"
                      >
                        <Grid3X3 className="h-4 w-4 mr-2" />
                        Cards
                      </Button>
                      <Button
                        variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('calendar')}
                        className="rounded-md flex-1 sm:flex-none min-w-[100px]"
                      >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Display */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchedules.map((schedule, index) => (
                  <Card
                    key={schedule.id}
                    className={`rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border-0 ${getCardStyling(schedule, index)} hover:scale-105`}
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
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{schedule.day}</span>
                      </div>
                      
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

                {filteredSchedules.length === 0 && (
                  <Card className="rounded-2xl shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Tidak ada jadwal ditemukan
                      </h3>
                      <p className="text-gray-500">
                        Coba ubah filter atau kata kunci pencarian
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Calendar Header */}
                    <div className="grid grid-cols-7 border-b">
                      <div className="p-4 bg-gray-50 border-r">
                        <span className="text-sm font-medium text-gray-600">Waktu</span>
                      </div>
                      {weekDays.map(day => (
                        <div key={day} className="p-4 bg-gray-50 border-r last:border-r-0">
                          <div className="text-center">
                            <span className="text-sm font-medium text-gray-800">{day}</span>
                            {day === getCurrentDay() && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Calendar Body */}
                    {timeSlots.map(timeSlot => (
                      <div key={timeSlot} className="grid grid-cols-7 border-b last:border-b-0">
                        {/* Time Column */}
                        <div className="p-3 bg-gray-50 border-r">
                          <span className="text-sm text-gray-600">{timeSlot}</span>
                        </div>
                        
                        {/* Day Columns */}
                        {weekDays.map(day => {
                          const schedule = getScheduleForDayAndTime(day, timeSlot);
                          const duration = schedule ? getClassDuration(schedule.time) : 1;
                          
                          return (
                            <div key={`${day}-${timeSlot}`} className="border-r last:border-r-0 min-h-[60px] relative">
                              {schedule && (
                                <div 
                                  className={`absolute inset-x-1 top-1 rounded-lg p-2 text-xs ${getCardStyling(schedule, 0)} transition-all duration-200 hover:shadow-md cursor-pointer`}
                                  style={{ 
                                    height: `${Math.max(duration * 60 - 8, 50)}px`,
                                    zIndex: 10 
                                  }}
                                  title={`${schedule.courseName} - ${schedule.lecturer}`}
                                >
                                  <div className="font-semibold text-gray-800 mb-1 leading-tight">
                                    {schedule.courseName}
                                  </div>
                                  <div className="text-gray-600 mb-1">
                                    {schedule.time}
                                  </div>
                                  <div className="text-gray-600">
                                    {schedule.room}
                                  </div>
                                  {getStatusBadge(schedule) && (
                                    <div className="mt-1">
                                      {getStatusBadge(schedule)}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                
                {filteredSchedules.length === 0 && (
                  <div className="p-12 text-center">
                    <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Tidak ada jadwal ditemukan
                    </h3>
                    <p className="text-gray-500">
                      Coba ubah filter atau kata kunci pencarian
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        );
      case 'stats':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Statistik Semester
            </h2>
            {(() => {
              const stats = getStatistics();
              return (
                <div className="space-y-6">
                  {/* Main Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-r from-blue-50 to-blue-100">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Total SKS</p>
                            <p className="text-2xl font-bold text-blue-800">{stats.totalSKS}</p>
                          </div>
                          <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-r from-green-50 to-green-100">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-medium">Total Mata Kuliah</p>
                            <p className="text-2xl font-bold text-green-800">{stats.totalClasses}</p>
                          </div>
                          <Calendar className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-r from-purple-50 to-purple-100">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600 font-medium">Hari Tersibuk</p>
                            <p className="text-lg font-bold text-purple-800">{stats.busiestDay.day}</p>
                            <p className="text-xs text-purple-600">{stats.busiestDay.count} kelas</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-r from-orange-50 to-orange-100">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-orange-600 font-medium">Rata-rata Durasi</p>
                            <p className="text-2xl font-bold text-orange-800">{stats.avgDuration.toFixed(1)}h</p>
                          </div>
                          <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Classes per Day */}
                    <Card className="rounded-2xl shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">Distribusi Kelas per Hari</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {weekDays.map(day => (
                            <div key={day} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{day}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(stats.classesPerDay[day] / Math.max(...Object.values(stats.classesPerDay))) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 w-8 text-right">{stats.classesPerDay[day]}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Time Distribution */}
                    <Card className="rounded-2xl shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">Distribusi Waktu</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Pagi (07:00-12:00)</span>
                            </div>
                            <span className="text-sm text-gray-600">{stats.timeDistribution.morning} kelas</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Siang (12:00-17:00)</span>
                            </div>
                            <span className="text-sm text-gray-600">{stats.timeDistribution.afternoon} kelas</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Sore (17:00+)</span>
                            </div>
                            <span className="text-sm text-gray-600">{stats.timeDistribution.evening} kelas</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })()}
          </>
        );
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {renderContent()}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}