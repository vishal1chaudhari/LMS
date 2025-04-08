import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required']
  },
  order: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Video', 'Text', 'Quiz', 'Assignment'],
    required: true
  },
  duration: {
    type: String,
    required: [true, 'Lesson duration is required']
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  },
  videoUrl: {
    type: String
  },
  resources: [{
    title: String,
    fileUrl: String,
    fileType: String
  }]
}, {
  timestamps: true
});

// Create compound index for module and order
lessonSchema.index({ moduleId: 1, order: 1 }, { unique: true });

export const Lesson = mongoose.model('Lesson', lessonSchema); 