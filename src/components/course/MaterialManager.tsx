import React, { useState, useEffect } from 'react';
import { CourseMaterial } from '../../types/courseContent';
import {
  getMaterials,
  uploadMaterial,
  updateMaterial,
  deleteMaterial
} from '../../services/courseContent';

interface MaterialManagerProps {
  courseId: string;
  onMaterialSelect?: (materialId: string) => void;
}

const MaterialManager: React.FC<MaterialManagerProps> = ({ courseId, onMaterialSelect }) => {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  const fetchMaterials = async () => {
    try {
      const data = await getMaterials(courseId);
      setMaterials(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      setError('Please select a file to upload');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('file', formData.file);
    formDataToSend.append('courseId', courseId);

    try {
      const newMaterial = await uploadMaterial(formDataToSend);
      setMaterials([...materials, newMaterial]);
      setShowForm(false);
      setFormData({ title: '', description: '', file: null });
      setUploadProgress(0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload material');
    }
  };

  const handleDelete = async (materialId: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteMaterial(materialId);
        setMaterials(materials.filter(material => material._id !== materialId));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete material');
      }
    }
  };

  if (loading) return <div>Loading materials...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Materials</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Upload Material'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-md shadow">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              File
            </label>
            <input
              type="file"
              id="file"
              required
              className="mt-1 block w-full"
              onChange={handleFileChange}
            />
          </div>
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Upload Material
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material) => (
          <div
            key={material._id}
            className="bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{material.title}</h3>
                <p className="text-gray-600">{material.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Type: {material.fileType}</p>
                  <p>Size: {(material.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(material._id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialManager; 