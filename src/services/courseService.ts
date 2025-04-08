import { api } from '@/lib/api';

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  status: 'Active' | 'Draft';
  createdAt: string;
  updatedAt: string;
}

export const courseService = {
  async getAllCourses() {
    return api.get<Course[]>('/courses');
  },

  async getCourse(id: string) {
    return api.get<Course>(`/courses/${id}`);
  },

  async createCourse(courseData: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>) {
    return api.post<Course>('/courses', courseData);
  },

  async updateCourse(id: string, courseData: Partial<Course>) {
    return api.put<Course>(`/courses/${id}`, courseData);
  },

  async deleteCourse(id: string) {
    return api.delete(`/courses/${id}`);
  },
}; 