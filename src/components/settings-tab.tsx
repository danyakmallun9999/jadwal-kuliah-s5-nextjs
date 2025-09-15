'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { NotificationToggle } from './notification-toggle';
import { Bell, Download, Share2, Moon, Sun, Calendar, Info } from 'lucide-react';
import { courseSchedules } from '@/data/sample-data';
import type { jsPDF } from 'jspdf';

export function SettingsTab() {
  const [darkMode, setDarkMode] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    // Apply dark mode class if needed
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    
    // Save to localStorage
    localStorage.setItem('darkMode', checked.toString());
    
    // Toggle dark mode class on document root
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const exportToPDF = async () => {
    try {
      setExporting(true);

      // Dynamically import jsPDF and jspdf-autotable
      const jsPDFModule = await import('jspdf');
      const autoTableModule = await import('jspdf-autotable');
      
      // Create new document
      const doc = new jsPDFModule.jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text('Jadwal Kuliah', 14, 15);
      doc.setFontSize(12);
      doc.text('Semester Gasal-1 2025/2026', 14, 22);

      // Add schedule table
      const tableData = courseSchedules.map(schedule => [
        schedule.day,
        schedule.time,
        schedule.courseName,
        schedule.courseCode,
        schedule.room,
        schedule.lecturer
      ]);

      // Add table using autoTable
      autoTableModule.default(doc, {
        startY: 30,
        head: [['Hari', 'Waktu', 'Mata Kuliah', 'Kode', 'Ruang', 'Dosen']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 20 },
          2: { cellWidth: 40 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 'auto' }
        }
      });

      // Save the PDF
      doc.save('jadwal-kuliah.pdf');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Gagal mengekspor ke PDF. Silakan coba lagi.');
    } finally {
      setExporting(false);
    }
  };

  const exportToGoogleCalendar = () => {
    // Generate Google Calendar events for each schedule
    const events = courseSchedules.map(schedule => {
      // Parse time
      const [startTime, endTime] = schedule.time.split('-');
      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');

      // Create event date (use next occurrence of the day)
      const today = new Date();
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayIndex = days.indexOf(schedule.day);
      const currentDayIndex = today.getDay();
      let daysUntilNext = dayIndex - currentDayIndex;
      if (daysUntilNext <= 0) daysUntilNext += 7;

      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + daysUntilNext);
      eventDate.setHours(parseInt(startHour), parseInt(startMinute), 0);

      const endDate = new Date(eventDate);
      endDate.setHours(parseInt(endHour), parseInt(endMinute), 0);

      // Create event details
      const event = {
        title: schedule.courseName,
        details: `Kode: ${schedule.courseCode}\nKelas: ${schedule.class}\nDosen: ${schedule.lecturer}\nRuang: ${schedule.room}`,
        start: eventDate.toISOString(),
        end: endDate.toISOString(),
        location: schedule.room
      };

      return event;
    });

    // Generate Google Calendar URL
    const calendarUrls = events.map(event => {
      const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
      const params = new URLSearchParams({
        text: event.title,
        details: event.details,
        location: event.location,
        dates: `${event.start.replace(/[-:]/g, '')}/${event.end.replace(/[-:]/g, '')}`,
        recur: 'RRULE:FREQ=WEEKLY;COUNT=16' // Repeat for 16 weeks
      });

      return `${baseUrl}&${params.toString()}`;
    });

    // Open all events in new tabs
    calendarUrls.forEach(url => window.open(url, '_blank'));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <Info className="h-6 w-6" />
        Pengaturan
      </h2>

      {/* Notifications */}
      <Card className="rounded-2xl shadow-sm border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Bell className="h-5 w-5" />
            Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Status Notifikasi</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aktifkan pengingat jadwal kuliah</p>
            </div>
            <NotificationToggle variant="card" />
          </div>
        </CardContent>
      </Card>

      {/* Export */}
      <Card className="rounded-2xl shadow-sm border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Download className="h-5 w-5" />
            Export Jadwal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start rounded-xl"
            onClick={exportToPDF}
            disabled={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Mengekspor...' : 'Export ke PDF'}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start rounded-xl"
            onClick={exportToGoogleCalendar}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Export ke Google Calendar
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="rounded-2xl shadow-sm border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Tampilan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ubah tema aplikasi</p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="rounded-2xl shadow-sm border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-gray-800 dark:text-gray-200 font-medium">Jadwal Kuliah</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Versi 1.0.0</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">© 2025 AI Assistant</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}