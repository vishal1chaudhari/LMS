import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Lesson } from '../../types/courseContent';
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons
} from '../../services/courseContent';

interface LessonManagerProps {
  moduleId: string;
  onLessonSelect?: (lessonId: string) => void;
}

const LessonManager: React.FC<LessonManagerProps> = ({ moduleId, onLessonSelect }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'Text' as const,
    duration: '',
    order: 0
  });

  useEffect(() => {
    fetchLessons();
  }, [moduleId]);

  const fetchLessons = async () => {
    try {
      const data = await getLessons(moduleId);
      setLessons(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newLesson = await createLesson({
        ...formData,
        moduleId
      });
      setLessons([...lessons, newLesson]);
      setShowForm(false);
      setFormData({
        title: '',
        content: '',
        type: 'Text',
        duration: '',
        order: 0
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create lesson');
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteLesson(lessonId);
        setLessons(lessons.filter(lesson => lesson._id !== lessonId));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete lesson');
      }
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLessons(items);

    try {
      await reorderLessons(moduleId, items.map(item => item._id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reorder lessons');
      fetchLessons(); // Revert to original order
    }
  };

  if (loading) return <div>Loading lessons...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Module Lessons</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Lesson'}
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
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as 'Text' | 'Video' | 'Quiz' | 'Assignment'
                })
              }
            >
              <option value="Text">Text</option>
              <option value="Video">Video</option>
              <option value="Quiz">Quiz</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <div className="mt-1">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                className="h-64 mb-12"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Lesson
          </button>
        </form>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="lessons">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {lessons.map((lesson, index) => (
                <Draggable
                  key={lesson._id}
                  draggableId={lesson._id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{lesson.title}</h3>
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span>Type: {lesson.type}</span>
                            <span>Duration: {lesson.duration} minutes</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onLessonSelect?.(lesson._id)}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(lesson._id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default LessonManager; 