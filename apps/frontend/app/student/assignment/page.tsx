'use client';

import React, { useState } from 'react';

const AssignmentSubmission = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file!');
      return;
    }

    // File upload testing
    console.log('Uploading file:', selectedFile.name);

    // TODO: Replace with API
    alert(`File ${selectedFile.name} uploaded successfully!`);
  };

  return (
    <div className="container mt-5">
      <h1>Submit Assignment</h1>
      <p>Upload your assignment file below:</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AssignmentSubmission;
