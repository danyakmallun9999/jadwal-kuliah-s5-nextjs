'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CourseSchedule } from '@/types/schedule';
import { days } from '@/data/sample-data';

interface ScheduleFormProps {
  schedule?: CourseSchedule;
  onSubmit: (schedule: Omit<CourseSchedule, 'id'>) => void;
  trigger?: React.ReactNode;
}

export function ScheduleForm({ schedule, onSubmit, trigger }: ScheduleFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: schedule?.day || '',
    time: schedule?.time || '',
    courseCode: schedule?.courseCode || '',
    courseName: schedule?.courseName || '',
    credits: schedule?.credits || 2,
    class: schedule?.class || '',
    lecturer: schedule?.lecturer || '',
    room: schedule?.room || '',
    faculty: schedule?.faculty || 'Fak. Sains & Teknologi-1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
    setFormData({
      day: '',
      time: '',
      courseCode: '',
      courseName: '',
      credits: 2,
      class: '',
      lecturer: '',
      room: '',
      faculty: 'Fak. Sains & Teknologi-1'
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-xl">
            Tambah Jadwal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {schedule ? 'Edit Jadwal Kuliah' : 'Tambah Jadwal Kuliah'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Hari</Label>
              <Select value={formData.day} onValueChange={(value) => handleChange('day', value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Waktu</Label>
              <Input
                id="time"
                placeholder="07:30-09:10"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseCode">Kode Mata Kuliah</Label>
              <Input
                id="courseCode"
                placeholder="21TIF607"
                value={formData.courseCode}
                onChange={(e) => handleChange('courseCode', e.target.value)}
                className="rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credits">SKS</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => handleChange('credits', parseInt(e.target.value))}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseName">Nama Mata Kuliah</Label>
            <Input
              id="courseName"
              placeholder="Teori Bahasa dan Automata"
              value={formData.courseName}
              onChange={(e) => handleChange('courseName', e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Kelas</Label>
              <Input
                id="class"
                placeholder="5TIFA"
                value={formData.class}
                onChange={(e) => handleChange('class', e.target.value)}
                className="rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room">Ruang</Label>
              <Input
                id="room"
                placeholder="Ruang D102"
                value={formData.room}
                onChange={(e) => handleChange('room', e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lecturer">Dosen Pengampu</Label>
            <Input
              id="lecturer"
              placeholder="NADIA ANNISA MAORI, S.Kom., M.Kom."
              value={formData.lecturer}
              onChange={(e) => handleChange('lecturer', e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty">Fakultas</Label>
            <Input
              id="faculty"
              placeholder="Fak. Sains & Teknologi-1"
              value={formData.faculty}
              onChange={(e) => handleChange('faculty', e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button type="submit" className="rounded-xl">
              {schedule ? 'Update' : 'Tambah'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
