import express from 'express';
import { CourseMaterial } from '../models/CourseMaterial';
import { Course } from '../models/Course';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/materials';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all materials for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const materials = await CourseMaterial.find({ 
      courseId: req.params.courseId,
      status: 'Active'
    }).sort({ createdAt: -1 });
    res.json(materials);
  } catch (error: any) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ 
      message: 'Error fetching materials', 
      error: error.message 
    });
  }
});

// Get single material
router.get('/:id', async (req, res) => {
  try {
    const material = await CourseMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching material', 
      error: error.message 
    });
  }
});

// Upload material
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Verify course exists
    const course = await Course.findById(req.body.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const material = new CourseMaterial({
      courseId: req.body.courseId,
      title: req.body.title,
      description: req.body.description,
      fileUrl: `/uploads/materials/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.body.uploadedBy // This should come from auth middleware
    });
    
    await material.save();
    res.status(201).json(material);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error uploading material', 
      error: error.message 
    });
  }
});

// Update material
router.put('/:id', async (req, res) => {
  try {
    const material = await CourseMaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error updating material', 
      error: error.message 
    });
  }
});

// Delete material
router.delete('/:id', async (req, res) => {
  try {
    const material = await CourseMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Delete the file
    const filePath = path.join(process.cwd(), material.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the record
    await material.deleteOne();
    res.json({ message: 'Material deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error deleting material', 
      error: error.message 
    });
  }
});

export default router; 