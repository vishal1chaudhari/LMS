import axios from 'axios';
import { API_URL } from '../config';

// Module APIs
export const getModules = async (courseId: string) => {
  const response = await axios.get(`${API_URL}/modules/course/${courseId}`);
  return response.data;
};

export const getModule = async (id: string) => {
  const response = await axios.get(`${API_URL}/modules/${id}`);
  return response.data;
};

export const createModule = async (moduleData: any) => {
  const response = await axios.post(`${API_URL}/modules`, moduleData);
  return response.data;
};

export const updateModule = async (id: string, moduleData: any) => {
  const response = await axios.put(`${API_URL}/modules/${id}`, moduleData);
  return response.data;
};

export const deleteModule = async (id: string) => {
  const response = await axios.delete(`${API_URL}/modules/${id}`);
  return response.data;
};

export const reorderModules = async (courseId: string, moduleIds: string[]) => {
  const response = await axios.put(`${API_URL}/modules/reorder/${courseId}`, { moduleIds });
  return response.data;
};

// Lesson APIs
export const getLessons = async (moduleId: string) => {
  const response = await axios.get(`${API_URL}/lessons/module/${moduleId}`);
  return response.data;
};

export const getLesson = async (id: string) => {
  const response = await axios.get(`${API_URL}/lessons/${id}`);
  return response.data;
};

export const createLesson = async (lessonData: any) => {
  const response = await axios.post(`${API_URL}/lessons`, lessonData);
  return response.data;
};

export const updateLesson = async (id: string, lessonData: any) => {
  const response = await axios.put(`${API_URL}/lessons/${id}`, lessonData);
  return response.data;
};

export const deleteLesson = async (id: string) => {
  const response = await axios.delete(`${API_URL}/lessons/${id}`);
  return response.data;
};

export const reorderLessons = async (moduleId: string, lessonIds: string[]) => {
  const response = await axios.put(`${API_URL}/lessons/reorder/${moduleId}`, { lessonIds });
  return response.data;
};

// Course Material APIs
export const getMaterials = async (courseId: string) => {
  const response = await axios.get(`${API_URL}/materials/course/${courseId}`);
  return response.data;
};

export const getMaterial = async (id: string) => {
  const response = await axios.get(`${API_URL}/materials/${id}`);
  return response.data;
};

export const uploadMaterial = async (formData: FormData) => {
  const response = await axios.post(`${API_URL}/materials`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateMaterial = async (id: string, materialData: any) => {
  const response = await axios.put(`${API_URL}/materials/${id}`, materialData);
  return response.data;
};

export const deleteMaterial = async (id: string) => {
  const response = await axios.delete(`${API_URL}/materials/${id}`);
  return response.data;
};

// Enrollment APIs
export const getStudentEnrollments = async (studentId: string) => {
  const response = await axios.get(`${API_URL}/enrollments/student/${studentId}`);
  return response.data;
};

export const getCourseEnrollments = async (courseId: string) => {
  const response = await axios.get(`${API_URL}/enrollments/course/${courseId}`);
  return response.data;
};

export const getEnrollment = async (id: string) => {
  const response = await axios.get(`${API_URL}/enrollments/${id}`);
  return response.data;
};

export const createEnrollment = async (enrollmentData: any) => {
  const response = await axios.post(`${API_URL}/enrollments`, enrollmentData);
  return response.data;
};

export const updateEnrollmentStatus = async (id: string, status: string) => {
  const response = await axios.put(`${API_URL}/enrollments/${id}/status`, { status });
  return response.data;
};

export const completeLesson = async (enrollmentId: string, lessonId: string) => {
  const response = await axios.post(`${API_URL}/enrollments/${enrollmentId}/complete-lesson`, { lessonId });
  return response.data;
};

export const deleteEnrollment = async (id: string) => {
  const response = await axios.delete(`${API_URL}/enrollments/${id}`);
  return response.data;
}; 