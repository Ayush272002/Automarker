'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';
import { Button } from '@repo/ui';
import { User, FileText, Clock, X } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Submission {
  id: string;
  studentName: string;
  submittedAt: string;
  marksAchieved: number;
  logs: string | null;
  assignmentZip: string;
}

interface Assignment {
  title: string;
  maxMarks: number;
}

export default function AssignmentSubmissions({
  params,
}: {
  params: { courseId: string; assignmentId: string };
}) {
  const { courseId, assignmentId } = params;
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/assignments/${assignmentId}/submissions`,
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
          throw new Error('Failed to fetch submissions');
        }

        const data = await res.json();
        setSubmissions(data.submissions);
        setAssignment(data.assignment);
      } catch (error) {
        toast.error('Failed to fetch submissions');
        console.error(error);
      }
    }

    fetchSubmissions();
  }, [assignmentId, router]);

  if (!assignment) {
    return null;
  }

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
          className="p-6 bg-gradient-to-r from-blue-700 to-purple-500 rounded-lg shadow-lg mb-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold">{assignment.title}</h2>
          <p className="mt-2 text-gray-200">
            Maximum Marks: {assignment.maxMarks}
          </p>
        </motion.div>

        <Card className="bg-gray-800">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Student Name</TableHead>
                  <TableHead className="text-white">Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <TableCell className="font-medium text-white">
                      {submission.studentName}
                    </TableCell>
                    <TableCell className="text-white">
                      {submission.marksAchieved === -1 ? (
                        <span className="text-yellow-400">
                          Under Evaluation
                        </span>
                      ) : (
                        <span className="text-green-400">
                          {submission.marksAchieved} / {assignment.maxMarks}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.main>

      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-transparent border-none shadow-none">
                <CardHeader className="flex items-center justify-between space-x-3 relative">
                  <div className="flex items-center space-x-3">
                    <User className="h-6 w-6 text-blue-400" />
                    <CardTitle>{selectedSubmission.studentName}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedSubmission(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">
                      Submitted:{' '}
                      {new Date(
                        selectedSubmission.submittedAt
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Marks:</span>{' '}
                    {selectedSubmission.marksAchieved === -1 ? (
                      <span className="text-yellow-400">Under Evaluation</span>
                    ) : (
                      <span className="text-green-400">
                        {selectedSubmission.marksAchieved} /{' '}
                        {assignment.maxMarks}
                      </span>
                    )}
                  </div>
                  {selectedSubmission.logs && (
                    <div>
                      <h4 className="font-semibold mb-2">Logs:</h4>
                      <pre className="bg-gray-900 p-2 rounded-md text-xs overflow-x-auto whitespace-pre-wrap max-h-40">
                        {selectedSubmission.logs}
                      </pre>
                    </div>
                  )}
                  <a
                    href={selectedSubmission.assignmentZip}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download Submission</span>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
