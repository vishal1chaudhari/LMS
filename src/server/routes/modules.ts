import express from 'express';
import { Module } from '../models/Module';
import { Course } from '../models/Course';

const router = express.Router();

// Get all modules for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const modules = await Module.find({ courseId: req.params.courseId })
      .sort({ order: 1 });
    res.json(modules);
  } catch (error: any) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ 
      message: 'Error fetching modules', 
      error: error.message 
    });
  }
});

// Get single module
router.get('/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json(module);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching module', 
      error: error.message 
    });
  }
});

// Create module
router.post('/', async (req, res) => {
  try {
    // Verify course exists
    const course = await Course.findById(req.body.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get the highest order number
    const lastModule = await Module.findOne({ courseId: req.body.courseId })
      .sort({ order: -1 });
    
    const order = lastModule ? lastModule.order + 1 : 1;

    const module = new Module({
      ...req.body,
      order
    });
    
    await module.save();
    res.status(201).json(module);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error creating module', 
      error: error.message 
    });
  }
});

// Update module
router.put('/:id', async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json(module);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error updating module', 
      error: error.message 
    });
  }
});

// Delete module
router.delete('/:id', async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json({ message: 'Module deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error deleting module', 
      error: error.message 
    });
  }
});

// Reorder modules
router.put('/reorder/:courseId', async (req, res) => {
  try {
    const { moduleIds } = req.body;
    const updates = moduleIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index + 1 }
      }
    }));

    await Module.bulkWrite(updates);
    res.json({ message: 'Modules reordered successfully' });
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error reordering modules', 
      error: error.message 
    });
  }
});

export default router; 