'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UploadClient } from '@uploadcare/upload-client';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@repo/ui';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AssignmentPage() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submission, setSubmission] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        const submissionResponse = await axios.get(
          `${API_BASE_URL}/api/v1/assignments/${assignmentId}/status`,
          {
            withCredentials: true,
          }
        );

        setSubmission(submissionResponse.data);
      } catch (err) {
        setError('Error fetching assignment details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [assignmentId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]!);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    setUploading(true);
    try {
      const client = new UploadClient({
        publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
      });

      const fileInfo = await client.uploadFile(file);
      const fileUrl = fileInfo.cdnUrl;

      toast.success('File uploaded successfully.');

      await axios.post(
        `${API_BASE_URL}/api/v1/assignments/${assignmentId}/submit`,
        { assignmentZip: fileUrl },
        { withCredentials: true }
      );

      toast.success('Assignment submitted successfully!');
      setIsModalOpen(false);

      const submissionResponse = await axios.get(
        `${API_BASE_URL}/api/v1/assignments/${assignmentId}/status`,
        {
          withCredentials: true,
        }
      );
      setSubmission(submissionResponse.data);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit the assignment.');
    } finally {
      setUploading(false);
    }
  };

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
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
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

        {submission?.status === 'graded' ? (
          <div className="mt-4 p-4 bg-green-800 rounded-lg shadow-lg">
            <p className="text-lg font-bold text-green-400">
              Marks Achieved: {submission.marksAchieved} / {assignment.maxMarks}
            </p>
          </div>
        ) : submission?.status === 'submitted' ? (
          <div className="mt-4 p-4 bg-yellow-800 rounded-lg shadow-lg">
            <p className="text-lg font-bold text-yellow-400">
              Assignment Submitted. Awaiting Grading.
            </p>
          </div>
        ) : submission?.status === 'unsubmitted' ? (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Assignment
              </motion.button>
            </DialogTrigger>

            <DialogContent className="bg-cream text-black p-8 rounded-lg shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Upload Your Assignment
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Please upload the assignment zip file.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center mt-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block mb-4 text-black"
                />
                {file && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-sm text-green-400"
                  >
                    Selected File: {file.name}
                  </motion.div>
                )}
                <div className="mt-6 flex gap-4">
                  <motion.button
                    onClick={handleSubmit}
                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                      uploading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    disabled={uploading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {uploading ? (
                      <Loader2 className="animate-spin h-5 w-5 inline-block mr-2" />
                    ) : null}
                    Submit Assignment
                  </motion.button>
                  <DialogClose className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Cancel
                  </DialogClose>
                </div>
              </div>

              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </motion.main>

      <footer className="p-6 bg-gray-900 text-center text-gray-400">
        <p>Good luck with your assignment!</p>
      </footer>
    </div>
  );
}
