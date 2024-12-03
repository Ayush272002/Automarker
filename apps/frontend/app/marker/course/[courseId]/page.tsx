'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Assignment } from 'types/Assignment';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { FileText } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CourseAssignments({
  params,
}: {
  params: { courseId: string };
}) {
  const { courseId } = params;
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    async function fetchAssignments() {
      if (!courseId) {
        console.error('No course ID provided');
        toast.error('Failed to identify course.');
        return;
      }
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/assignments/all?courseId=${courseId}`,
          {
            credentials: 'include',
          }
        );

        if (res.status === 403) {
          router.push('/marker/dashboard');
          toast.error('You are not authorized to access this page');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch assignments');
        }

        const data: Assignment[] = await res.json();
        setAssignments(data);
      } catch (error) {
        toast.error('Failed to fetch assignments');
        console.error(error);
      }
    }

    fetchAssignments();
  }, [courseId]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative">
      <motion.div
        className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 p-6"
      >
        <motion.div
          className="p-6 bg-gradient-to-r from-blue-700 to-purple-500 rounded-lg shadow-lg"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="mt-2 text-gray-200">
            Here are the assignments for this course.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {assignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gray-800 text-white">
                <CardHeader className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-400" />
                  <CardTitle>{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mt-2">{assignment.description}</p>
                  <p className="mt-4">
                    <span className="font-semibold">Due Date:</span>{' '}
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}