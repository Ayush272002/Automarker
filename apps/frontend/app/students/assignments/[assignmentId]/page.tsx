'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AssignmentPage() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchAssignmentData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/assignments/${assignmentId}`,
          {
            withCredentials: true,
          }
        );
        setAssignment(response.data);
      } catch (err) {
        setError('Error fetching assignment details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <Loader2 className="animate-spin h-12 w-12 text-blue-400" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-gradient-to-r from-purple-700 to-blue-600 shadow-lg"
      >
        <h1 className="text-3xl font-bold">{assignment.title}</h1>
        <p className="mt-2 text-gray-200">
          Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
        </p>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 p-6"
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Description</h2>
          <p className="mt-2 text-gray-300">{assignment.description}</p>
        </div>

        <Link href={`/students/assignments/${assignmentId}/submit`}>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Submit Assignment
          </button>
        </Link>
      </motion.main>

      <footer className="p-6 bg-gray-900 text-center text-gray-400">
        <p>Good luck with your assignment!</p>
      </footer>
    </div>
  );
}
