import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from '../lib/db';
import courseRoutes from './routes/courses';
import moduleRoutes from './routes/modules';
import lessonRoutes from './routes/lessons';
import materialRoutes from './routes/materials';
import enrollmentRoutes from './routes/enrollments';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Connect to MongoDB
connectDB().catch(console.error);

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 