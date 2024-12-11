'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from '@repo/ui';
import { CalendarDays, ClipboardList, User } from 'lucide-react';
import Link from 'next/link';
import StudentNavbar from 'components/StudentNavbar';
import LogoutButton from 'components/LogoutButton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Course = {
  id: string;
  name: string;
  description?: string;
  moduleLead?: string;
  progress?: number;
};

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/students/courses`,
        {
          withCredentials: true,
        }
      );
      setCourses(response.data.courses);
    } catch (err) {
      setError('Failed to fetch courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const overviewItems = [
    {
      title: 'Upcoming Deadlines',
      content: '3 assignments due this week',
      link: '/student/assignments',
      icon: ClipboardList,
    },
    {
      title: "Today's Schedule",
      content: '2 classes scheduled',
      link: '/student/calendar',
      icon: CalendarDays,
    },
    {
      title: 'Grades Overview',
      content: 'Semester GPA: 3.8',
      link: '/student/grades',
      icon: User,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 p-6 shadow-lg flex flex-col justify-between"
      >
        <StudentNavbar />
        <div className="mt-6">
          <LogoutButton />
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
          <h2 className="text-2xl font-bold">Welcome back, Student!</h2>
          <p className="mt-2 text-gray-200">
            Here's a quick overview of your progress this semester.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {overviewItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-gray-800 text-white">
                <CardHeader className="flex items-center space-x-3">
                  <item.icon className="h-6 w-6 text-blue-400" />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{item.content}</p>
                  <Link href={item.link}>
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

        <h3 className="mt-8 text-xl font-bold">My Courses</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
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
                      Instructor: {course.moduleLead || 'N/A'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full">
                      <Progress
                        value={Math.random() * 100} // Replace with real progress when available
                        className="bg-gray-700"
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-200">
                        75% Complete
                      </span>
                    </div>
                    <Link href={`/students/courses/${course.id}`}>
                      <Button
                        variant="outline"
                        className="mt-4 text-blue-400 hover:text-blue-500"
                      >
                        Go to Course
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.main>
    </div>
  );
}
