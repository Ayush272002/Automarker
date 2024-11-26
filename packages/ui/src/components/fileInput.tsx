import React from 'react';
import { TextField, Box } from '@mui/material';

interface FileInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ onChange }) => {
  return (
    <Box>
      <TextField
        type="file"
        onChange={onChange}
        inputProps={{ accept: '.pdf,.docx,.txt,.zip' }}
        fullWidth
      />
    </Box>
  );
};
