import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required'],
  },
  duration: {
    type: String,
    required: [true, 'Course duration is required'],
  },
  students: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: [true, 'Course level is required'],
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
  },
  status: {
    type: String,
    enum: ['Active', 'Draft'],
    default: 'Draft',
  },
}, {
  timestamps: true,
});

export const Course = mongoose.model('Course', courseSchema); 