import express from 'express';
import { Course } from '../models/Course';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all courses...');
    const courses = await Course.find().sort({ createdAt: -1 });
    console.log('Courses found:', courses);
    res.json(courses);
  } catch (error: any) {
    console.error('Error in GET /courses:', error);
    res.status(500).json({ 
      message: 'Error fetching courses', 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error });
  }
});

// Create course
router.post('/', async (req, res) => {
  try {
    console.log('Creating new course with data:', req.body);
    const course = new Course(req.body);
    console.log('Course model created:', course);
    await course.save();
    console.log('Course saved successfully:', course);
    res.status(201).json(course);
  } catch (error: any) {
    console.error('Error creating course:', error);
    res.status(400).json({ 
      message: 'Error creating course', 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Update course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course', error });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error });
  }
});

export default router; 