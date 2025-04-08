import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Module description is required']
  },
  order: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  },
  estimatedDuration: {
    type: String,
    required: [true, 'Estimated duration is required']
  }
}, {
  timestamps: true
});

// Create compound index for course and order
moduleSchema.index({ courseId: 1, order: 1 }, { unique: true });

export const Module = mongoose.model('Module', moduleSchema); 