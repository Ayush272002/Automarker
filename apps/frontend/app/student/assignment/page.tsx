'use client';

import React, { useState } from 'react';
import { Box, Button, Typography, Container, Alert } from '@mui/material';
import { FileInput } from '@repo/ui';

const AssignmentSubmission: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null); // Clear error message when a file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMessage('Please select a file!');
      return;
    }

    // File upload logic (mocked)
    console.log('Uploading file:', selectedFile.name);

    // TODO: Replace with API
    setSuccessMessage(`File ${selectedFile.name} uploaded successfully!`);
    setSelectedFile(null); // Clear file selection after submission
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Submit Assignment
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Upload your assignment file below:
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? (
            <Alert severity="success">{successMessage}</Alert>
          ) : null}
        </Box>
        <Box sx={{ mb: 3 }}>
          <FileInput onChange={handleFileChange} />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          disabled={!selectedFile}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default AssignmentSubmission;
