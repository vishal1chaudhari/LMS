import 'dotenv/config';
import connectDB from './db';

async function testConnection() {
  try {
    await connectDB();
    console.log('MongoDB connection test successful!');
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
  }
}

// Run the test
testConnection(); 