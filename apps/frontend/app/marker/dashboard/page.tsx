'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { ClipboardList, CheckSquare, FileCheck, User } from 'lucide-react';
import Link from 'next/link';
import { Course } from 'types/Course';
import { Stats } from 'types/Stats';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MarkerDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalStudents: 0,
    totalSubmissions: 0,
    pendingReviews: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/teachers/dashboard`, {
            credentials: 'include',
          }),
          fetch(`${API_BASE_URL}/api/v1/teachers/stats`, {
            credentials: 'include',
          }),
        ]);

        if (!coursesRes.ok || !statsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const coursesData: Course[] = await coursesRes.json();
        const statsData: Stats = await statsRes.json();

        setCourses(coursesData);
        setStats(statsData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

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
          {[
            {
              label: 'Total Courses',
              value: stats.totalCourses,
              icon: ClipboardList,
            },
            { label: 'Total Students', value: stats.totalStudents, icon: User },
            {
              label: 'Total Submissions',
              value: stats.totalSubmissions,
              icon: CheckSquare,
            },
            {
              label: 'Pending Reviews',
              value: stats.pendingReviews,
              icon: FileCheck,
            },
          ].map((stat, index) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {courses.map((course) => (
            <Card key={course.id} className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p>
                    <span className="font-semibold">Students:</span>{' '}
                    {course.studentCount}
                  </p>
                  <p>
                    <span className="font-semibold">Submitted:</span>{' '}
                    {course.submitted}
                  </p>
                  <p>
                    <span className="font-semibold">Not Submitted:</span>{' '}
                    {course.notSubmitted}
                  </p>
                </div>
                <Button variant="link" className="mt-4" asChild>
                  <Link href={`/marker/courses/${course.id}`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
