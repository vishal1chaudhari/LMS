import mongoose from 'mongoose';

const courseMaterialSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Material title is required'],
    trim: true
  },
  description: {
    type: String
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Archived'],
    default: 'Active'
  }
}, {
  timestamps: true
});

export const CourseMaterial = mongoose.model('CourseMaterial', courseMaterialSchema); 