export type Assignment = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  markingScript?: string;
  requiredFiles?: string;
  maxMarks: number;
  courseId: string;
};
