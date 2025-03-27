import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from '../lib/db';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().catch(console.error);

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 