export interface CourseSchedule {
  id: string;
  day: string;
  time: string;
  courseCode: string;
  courseName: string;
  credits: number;
  class: string;
  lecturer: string;
  room: string;
  faculty: string;
}

export interface FilterOptions {
  day?: string;
  lecturer?: string;
}

export interface StudentInfo {
  nim: string;
  name: string;
  batch: string;
  program: string;
  studyProgram: string;
}
