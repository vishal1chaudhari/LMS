export interface Module {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  status: 'Draft' | 'Published';
  estimatedDuration: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  _id: string;
  moduleId: string;
  title: string;
  content: string;
  order: number;
  type: 'Video' | 'Text' | 'Quiz' | 'Assignment';
  duration: string;
  status: 'Draft' | 'Published';
  videoUrl?: string;
  resources: {
    title: string;
    fileUrl: string;
    fileType: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseMaterial {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  status: 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollment {
  _id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  status: 'Active' | 'Completed' | 'Dropped';
  progress: number;
  lastAccessedAt: string;
  completedLessons: {
    lessonId: string;
    completedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ModuleFormData {
  courseId: string;
  title: string;
  description: string;
  estimatedDuration: string;
  status: 'Draft' | 'Published';
}

export interface LessonFormData {
  moduleId: string;
  title: string;
  content: string;
  type: 'Video' | 'Text' | 'Quiz' | 'Assignment';
  duration: string;
  status: 'Draft' | 'Published';
  videoUrl?: string;
  resources?: {
    title: string;
    fileUrl: string;
    fileType: string;
  }[];
}

export interface MaterialFormData {
  courseId: string;
  title: string;
  description?: string;
  file: File;
}

export interface EnrollmentFormData {
  courseId: string;
  studentId: string;
} 