import mongoose from 'mongoose';

const courseEnrollmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Dropped'],
    default: 'Active'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completedAt: Date
  }]
}, {
  timestamps: true
});

// Create compound index for course and student
courseEnrollmentSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

export const CourseEnrollment = mongoose.model('CourseEnrollment', courseEnrollmentSchema); 