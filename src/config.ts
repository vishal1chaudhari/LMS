export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const FILE_UPLOAD_LIMIT = 10 * 1024 * 1024; // 10MB

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/jpeg',
  'image/png'
]; 