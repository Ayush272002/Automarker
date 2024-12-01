'use client';

import { motion } from 'framer-motion';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from '@repo/ui';
import { ClipboardList, CheckSquare, FileCheck, User } from 'lucide-react';
import Link from 'next/link';

export default function MarkerDashboard() {
  const courses = [
    {
      name: 'Introduction to Programming',
      studentCount: 40,
      submitted: 25,
      notSubmitted: 15,
      id: 'course-1',
    },
    {
      name: 'Advanced Mathematics',
      studentCount: 30,
      submitted: 20,
      notSubmitted: 10,
      id: 'course-2',
    },
  ];

  const stats = [
    { label: 'Total Courses', value: 2, icon: ClipboardList },
    { label: 'Total Students', value: 70, icon: User },
    { label: 'Total Submissions', value: 45, icon: CheckSquare },
    { label: 'Pending Reviews', value: 15, icon: FileCheck },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative">
      <motion.div
        className="absolute inset-0 bg-grid-pattern opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-64 bg-gradient-to-b from-gray-800 to-gray-700 p-6 shadow-lg z-10"
      >
        <div className="flex items-center space-x-3">
          <ClipboardList className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-bold">Marker Dashboard</h1>
        </div>
        <nav className="mt-6 space-y-4">
          <Link
            href="/marker/dashboard"
            className="flex items-center space-x-2 hover:text-blue-400"
          >
            <ClipboardList className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/marker/courses"
            className="flex items-center space-x-2 hover:text-blue-400"
          >
            <FileCheck className="h-5 w-5" />
            <span>Courses</span>
          </Link>
          <Link
            href="/marker/submissions"
            className="flex items-center space-x-2 hover:text-blue-400"
          >
            <CheckSquare className="h-5 w-5" />
            <span>Submissions</span>
          </Link>
          <Link
            href="/marker/profile"
            className="flex items-center space-x-2 hover:text-blue-400"
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        </nav>
      </motion.aside>

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
          <h2 className="text-2xl font-bold">Welcome back, Marker!</h2>
          <p className="mt-2 text-gray-200">
            Here's an overview of your current tasks and progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-gray-800 text-white">
                <CardHeader className="flex items-center space-x-3">
                  <stat.icon className="h-6 w-6 text-blue-400" />
                  <CardTitle>{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <h3 className="mt-8 text-xl font-bold">My Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="bg-gray-800 text-white">
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <p className="text-sm text-gray-400">
                    Total Students: {course.studentCount}
                  </p>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={(course.submitted / course.studentCount) * 100}
                    className="mt-2 bg-gray-700"
                  />
                  <div className="mt-2 text-sm">
                    <span className="text-green-400">
                      {course.submitted} Submitted
                    </span>
                    ,{' '}
                    <span className="text-red-400">
                      {course.notSubmitted} Not Submitted
                    </span>
                  </div>
                  <Link href={`/marker/courses/${course.id}`}>
                    <Button
                      variant="outline"
                      className="mt-4 text-blue-400 hover:text-blue-500"
                    >
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
