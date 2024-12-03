'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CoursePage() {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/assignments/all`,
          {
            params: { courseId },
            withCredentials: true,
          }
        );
        setAssignments(response.data);
      } catch (err) {
        setError('Error fetching assignments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <Loader2 className="animate-spin h-12 w-12 text-blue-400" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 p-6 shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <ArrowLeft className="h-6 w-6 text-blue-400" />
          <Link
            href="/students/dashboard"
            className="text-xl font-bold hover:text-blue-400 transition-all duration-300 hover:scale-105"
          >
            Back to Dashboard
          </Link>
        </div>
      </motion.aside>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 p-6"
      >
        <motion.div
          className="p-6 bg-gradient-to-r from-purple-700 to-blue-600 rounded-lg shadow-lg"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold">Course</h2>
          <p className="mt-2 text-gray-200">View the assignments below</p>
        </motion.div>

        <div className="mt-8">
          <h3 className="text-xl font-bold">Assignments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {assignments?.map((assignment: any, index: number) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="cursor-pointer"
              >
                <Card className="bg-gray-800 text-white transform hover:shadow-xl">
                  <CardHeader>
                    <CardTitle>{assignment.title}</CardTitle>
                    <p className="text-sm text-gray-400">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p>{assignment.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.main>
    </div>
  );
}
