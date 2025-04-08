import express from 'express';
import { Lesson } from '../models/Lesson';
import { Module } from '../models/Module';

const router = express.Router();

// Get all lessons for a module
router.get('/module/:moduleId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ moduleId: req.params.moduleId })
      .sort({ order: 1 });
    res.json(lessons);
  } catch (error: any) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ 
      message: 'Error fetching lessons', 
      error: error.message 
    });
  }
});

// Get single lesson
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching lesson', 
      error: error.message 
    });
  }
});

// Create lesson
router.post('/', async (req, res) => {
  try {
    // Verify module exists
    const module = await Module.findById(req.body.moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Get the highest order number
    const lastLesson = await Lesson.findOne({ moduleId: req.body.moduleId })
      .sort({ order: -1 });
    
    const order = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = new Lesson({
      ...req.body,
      order
    });
    
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error creating lesson', 
      error: error.message 
    });
  }
});

// Update lesson
router.put('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error updating lesson', 
      error: error.message 
    });
  }
});

// Delete lesson
router.delete('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error deleting lesson', 
      error: error.message 
    });
  }
});

// Reorder lessons
router.put('/reorder/:moduleId', async (req, res) => {
  try {
    const { lessonIds } = req.body;
    const updates = lessonIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index + 1 }
      }
    }));

    await Lesson.bulkWrite(updates);
    res.json({ message: 'Lessons reordered successfully' });
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error reordering lessons', 
      error: error.message 
    });
  }
});

export default router; 