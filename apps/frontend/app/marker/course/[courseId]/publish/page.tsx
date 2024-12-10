'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UploadClient } from '@uploadcare/upload-client';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PublishAssignment() {
  const router = useRouter();
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [markingScript, setMarkingScript] = useState<File | null>(null);
  const [dockerFile, setDockerFile] = useState<File | null>(null);
  const [boilerPlateCode, setBoilerPlateCode] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File): Promise<string | null> => {
    const client = new UploadClient({
      publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
    });

    try {
      const result = await client.uploadFile(file);
      toast.success(`${file.name} uploaded successfully!`);
      return result.cdnUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error(`Failed to upload ${file.name}.`);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !dueDate || !maxMarks || !courseId) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (!markingScript || !dockerFile || !boilerPlateCode) {
      toast.error('Please upload all the required files.');
      return;
    }

    setUploading(true);
    try {
      const markingScriptUrl = await handleFileUpload(markingScript);
      const dockerFileUrl = await handleFileUpload(dockerFile);
      const boilerPlateCodeUrl = await handleFileUpload(boilerPlateCode);

      if (!markingScriptUrl || !dockerFileUrl || !boilerPlateCodeUrl) {
        toast.error('File uploads failed. Please try again.');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/assignments`,
        {
          title,
          description,
          dueDate: new Date(dueDate).toISOString(),
          maxMarks: parseInt(maxMarks, 10),
          courseId,
          markingScript: markingScriptUrl,
          dockerFile: dockerFileUrl,
          boilerplate: boilerPlateCodeUrl,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success('Assignment published successfully!');
        router.push('/marker/dashboard');
      }
    } catch (error) {
      console.error('Assignment creation failed:', error);
      toast.error('Failed to publish assignment.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center p-6"
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-4">
            Publish Assignment
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Max Marks"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
            />

            <label className="block text-gray-400">Marking Script :</label>
            <input
              type="file"
              className="w-full p-2 rounded bg-gray-700 text-white"
              onChange={(e) => {
                if (e.target.files?.[0]) setMarkingScript(e.target.files[0]);
              }}
            />

            <label className="block text-gray-400">Docker File :</label>
            <input
              type="file"
              className="w-full p-2 rounded bg-gray-700 text-white"
              onChange={(e) => {
                if (e.target.files?.[0]) setDockerFile(e.target.files[0]);
              }}
            />

            <label className="block text-gray-400">Boiler Plate Code :</label>
            <input
              type="file"
              className="w-full p-2 rounded bg-gray-700 text-white"
              onChange={(e) => {
                if (e.target.files?.[0]) setBoilerPlateCode(e.target.files[0]);
              }}
            />

            <button
              className={`w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 ${
                uploading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={uploading}
              onClick={handleSubmit}
            >
              {uploading ? (
                <Loader2 className="animate-spin h-5 w-5 inline-block mr-2" />
              ) : null}
              Publish Assignment
            </button>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
