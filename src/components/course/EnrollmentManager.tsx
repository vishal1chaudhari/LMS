import React, { useState, useEffect } from 'react';
import { CourseEnrollment } from '../../types/courseContent';
import {
  getStudentEnrollments,
  getCourseEnrollments,
  createEnrollment,
  updateEnrollmentStatus,
  completeLesson,
  deleteEnrollment
} from '../../services/courseContent';

interface EnrollmentManagerProps {
  courseId: string;
  studentId?: string;
  onEnrollmentSelect?: (enrollmentId: string) => void;
}

const EnrollmentManager: React.FC<EnrollmentManagerProps> = ({
  courseId,
  studentId,
  onEnrollmentSelect
}) => {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: ''
  });

  useEffect(() => {
    fetchEnrollments();
  }, [courseId, studentId]);

  const fetchEnrollments = async () => {
    try {
      const data = studentId
        ? await getStudentEnrollments(studentId)
        : await getCourseEnrollments(courseId);
      setEnrollments(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newEnrollment = await createEnrollment({
        courseId,
        studentId: formData.studentId
      });
      setEnrollments([...enrollments, newEnrollment]);
      setShowForm(false);
      setFormData({ studentId: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create enrollment');
    }
  };

  const handleStatusChange = async (enrollmentId: string, newStatus: string) => {
    try {
      const updatedEnrollment = await updateEnrollmentStatus(enrollmentId, newStatus);
      setEnrollments(
        enrollments.map((enrollment) =>
          enrollment._id === enrollmentId ? updatedEnrollment : enrollment
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update enrollment status');
    }
  };

  const handleDelete = async (enrollmentId: string) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await deleteEnrollment(enrollmentId);
        setEnrollments(enrollments.filter((enrollment) => enrollment._id !== enrollmentId));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete enrollment');
      }
    }
  };

  if (loading) return <div>Loading enrollments...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Enrollments</h2>
        {!studentId && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {showForm ? 'Cancel' : 'Add Enrollment'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-md shadow">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Enrollment
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment._id}
            className="bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">Student ID: {enrollment.studentId}</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Status: {enrollment.status}</p>
                    <p>Progress: {enrollment.progress}%</p>
                    <p>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                    <p>Last Accessed: {new Date(enrollment.lastAccessedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={enrollment.status}
                    onChange={(e) => handleStatusChange(enrollment._id, e.target.value)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                  <button
                    onClick={() => handleDelete(enrollment._id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${enrollment.progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">
                <p>Completed Lessons: {enrollment.completedLessons.length}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrollmentManager; 