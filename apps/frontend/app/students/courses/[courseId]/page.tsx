'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Progress } from '@repo/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CoursePage() {
  const { courseName } = useParams();

  const courseDetails = {
    instructor: 'Dr. John Doe',
    syllabus: 'This course covers advanced topics in mathematics.',
    progress: 75,
    assignments: [
      { name: 'Assignment 1', dueDate: '2024-12-05', status: 'Pending' },
      { name: 'Assignment 2', dueDate: '2024-12-12', status: 'In Progress' },
      { name: 'Assignment 3', dueDate: '2024-12-19', status: 'Completed' },
    ],
  };

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
          <h2 className="text-2xl font-bold">{courseName || 'Course'}</h2>
          <p className="mt-2 text-gray-200">{courseDetails.syllabus}</p>
        </motion.div>

        <div className="mt-6">
          <h3 className="text-xl font-bold">Course Progress</h3>

          <div className="relative w-full h-8 bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${courseDetails.progress}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
              {courseDetails.progress}% Complete
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold">Assignments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {courseDetails.assignments.map((assignment, index) => (
              <motion.div
                key={index}
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
                    <CardTitle>{assignment.name}</CardTitle>
                    <p className="text-sm text-gray-400">
                      Due: {assignment.dueDate}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p>Status: {assignment.status}</p>
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
