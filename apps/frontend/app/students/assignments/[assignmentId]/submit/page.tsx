'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UploadClient } from '@uploadcare/upload-client';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SubmitAssignmentPage() {
  const { assignmentId } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        { fileUrl },
        { withCredentials: true }
      );

      toast.success('Assignment submitted successfully!');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit the assignment.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Submit Assignment</h1>

      <input
        type="file"
        onChange={handleFileChange}
        className="block mb-4 text-white"
      />

      {file && (
        <div className="text-sm text-green-400">Selected File: {file.name}</div>
      )}

      <button
        onClick={handleSubmit}
        className={`mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
          uploading ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="animate-spin h-5 w-5 inline-block mr-2" />
        ) : null}
        Submit Assignment
      </button>

      {submitted && (
        <p className="mt-4 text-green-400">
          Your assignment has been successfully submitted!
        </p>
      )}
    </div>
  );
}
