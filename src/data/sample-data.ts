import { CourseSchedule, StudentInfo } from '@/types/schedule';

export const studentInfo: StudentInfo = {
  nim: '231240001460',
  name: 'DANY AKMALLUN NI\'AM',
  batch: '2023',
  program: 'R.1',
  studyProgram: 'Teknik Informatika'
};

export const courseSchedules: CourseSchedule[] = [
  {
    id: '1',
    day: 'Selasa',
    time: '07:30-09:10',
    courseCode: '21TIF607',
    courseName: 'Teori Bahasa dan Automata',
    credits: 2,
    class: '5TIFA',
    lecturer: 'NADIA ANNISA MAORI, S.Kom., M.Kom.',
    room: 'Ruang D102',
    faculty: 'Fak. Sains & Teknologi-1'
  },
  {
    id: '2',
    day: 'Selasa',
    time: '10:00-11:40',
    courseCode: '21TIF501',
    courseName: 'Metode Penelitian',
    credits: 2,
    class: '5TIFA',
    lecturer: 'Ir. ADI SUCIPTO, M.Kom.',
    room: 'Ruang D304',
    faculty: 'Fak. Sains & Teknologi-1'
  },
  {
    id: '3',
    day: 'Rabu',
    time: '10:00-12:30',
    courseCode: '21TIF506',
    courseName: 'Analisis dan Perancangan Sistem',
    credits: 3,
    class: '5TIFC',
    lecturer: 'TEGUH TAMRIN, S.Kom., M.Kom.',
    room: 'Ruang D104 (Lab Komputer)',
    faculty: 'Fak. Sains & Teknologi-1'
  },
  {
    id: '4',
    day: 'Kamis',
    time: '07:30-10:00',
    courseCode: '21TIF503',
    courseName: 'Sistem Cerdas',
    credits: 2,
    class: '5TIFA',
    lecturer: 'NUR AENI WIDIASTUTI, S.Pd., M.Kom.',
    room: 'Ruang D303',
    faculty: 'Fak. Sains & Teknologi-1'
  },
  {
    id: '5',
    day: 'Kamis',
    time: '12:30-15:00',
    courseCode: '21TIF508',
    courseName: 'Sistem Informasi Geografis',
    credits: 3,
    class: '5TIFC',
    lecturer: 'HARMINTO MULYO, S.Kom. M.Kom.',
    room: 'Ruang D101 (Lab Komputer)',
    faculty: 'Fak. Sains & Teknologi-1'
  },
  {
    id: '6',
    day: 'Kamis',
    time: '15:00-16:40',
    courseCode: '21TIF507',
    courseName: 'Interaksi Manusia dan Komputer',
    credits: 2,
    class: '5TIFC',
    lecturer: 'GENTUR WAHYU NYIPTO WIBOWO, S.Kom., M.Kom.',
    room: 'Ruang D103 (Lab Komputer)',
    faculty: 'Fak. Sains & Teknologi-1'
  }
];

export const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export const lecturers = Array.from(new Set(courseSchedules.map(schedule => schedule.lecturer)));
