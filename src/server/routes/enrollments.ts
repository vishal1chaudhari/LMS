import express from 'express';
import { CourseEnrollment } from '../models/CourseEnrollment';
import { Course } from '../models/Course';
import { Lesson } from '../models/Lesson';

const router = express.Router();

// Get all enrollments for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const enrollments = await CourseEnrollment.find({ 
      studentId: req.params.studentId 
    })
    .populate('courseId', 'title description instructor')
    .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (error: any) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ 
      message: 'Error fetching enrollments', 
      error: error.message 
    });
  }
});

// Get all enrollments for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const enrollments = await CourseEnrollment.find({ 
      courseId: req.params.courseId 
    })
    .populate('studentId', 'name email')
    .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching enrollments', 
      error: error.message 
    });
  }
});

// Get single enrollment
router.get('/:id', async (req, res) => {
  try {
    const enrollment = await CourseEnrollment.findById(req.params.id)
      .populate('courseId')
      .populate('studentId', 'name email');
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json(enrollment);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching enrollment', 
      error: error.message 
    });
  }
});

// Create enrollment
router.post('/', async (req, res) => {
  try {
    // Verify course exists
    const course = await Course.findById(req.body.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await CourseEnrollment.findOne({
      courseId: req.body.courseId,
      studentId: req.body.studentId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new CourseEnrollment({
      courseId: req.body.courseId,
      studentId: req.body.studentId
    });
    
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error creating enrollment', 
      error: error.message 
    });
  }
});

// Update enrollment status
router.put('/:id/status', async (req, res) => {
  try {
    const enrollment = await CourseEnrollment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json(enrollment);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error updating enrollment status', 
      error: error.message 
    });
  }
});

// Mark lesson as completed
router.post('/:id/complete-lesson', async (req, res) => {
  try {
    const { lessonId } = req.body;
    
    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const enrollment = await CourseEnrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if lesson is already completed
    const isCompleted = enrollment.completedLessons.some(
      (completed) => completed.lessonId.toString() === lessonId
    );

    if (!isCompleted) {
      enrollment.completedLessons.push({
        lessonId,
        completedAt: new Date()
      });

      // Calculate progress
      const totalLessons = await Lesson.countDocuments({ moduleId: lesson.moduleId });
      const completedCount = enrollment.completedLessons.length;
      enrollment.progress = Math.round((completedCount / totalLessons) * 100);
      
      await enrollment.save();
    }

    res.json(enrollment);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error completing lesson', 
      error: error.message 
    });
  }
});

// Delete enrollment
router.delete('/:id', async (req, res) => {
  try {
    const enrollment = await CourseEnrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error deleting enrollment', 
      error: error.message 
    });
  }
});

export default router; 