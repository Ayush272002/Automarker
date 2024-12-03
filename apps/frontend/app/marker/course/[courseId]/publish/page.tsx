'use client';

import { motion } from 'framer-motion';
import PublishAssignmentForm from 'components/PublishAssignmentForm';

const CoursePage = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;

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
          <h2 className="text-2xl font-bold">Course Details</h2>
          <p className="mt-2 text-gray-200">
            Here, you can publish new assignments for the course.
          </p>
        </motion.div>

        <PublishAssignmentForm courseId={courseId} />
      </motion.main>
    </div>
  );
};

export default CoursePage;
