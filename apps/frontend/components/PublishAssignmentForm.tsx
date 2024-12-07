'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const PublishAssignmentForm = ({ courseId }: { courseId: string }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/assignments/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            dueDate,
            maxMarks,
            courseId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Assignment published successfully!');
        router.push(`/marker/courses/${courseId}`);
      } else {
        toast.error('Failed to publish the assignment');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label htmlFor="title" className="text-sm font-semibold">
          Assignment Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mt-2 bg-gray-800 text-white border-none rounded-md focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-semibold">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mt-2 bg-gray-800 text-white border-none rounded-md focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="text-sm font-semibold">
          Due Date
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 mt-2 bg-gray-800 text-white border-none rounded-md focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="maxMarks" className="text-sm font-semibold">
          Max Marks
        </label>
        <input
          type="number"
          id="maxMarks"
          value={maxMarks}
          onChange={(e) => setMaxMarks(Number(e.target.value))}
          className="w-full p-2 mt-2 bg-gray-800 text-white border-none rounded-md focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white mt-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Publish Assignment
      </button>
    </form>
  );
};

export default PublishAssignmentForm;
