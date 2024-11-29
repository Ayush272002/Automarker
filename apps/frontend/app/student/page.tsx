import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';

const StudentHome: React.FC = () => {
  // Mock data for assignments

  // TODO: Replace with API Call
  const currentAssignments = [
    { id: 1, title: 'Assignment 1', dueDate: '2024-12-01', status: 'Pending' },
    { id: 2, title: 'Assignment 2', dueDate: '2024-12-10', status: 'Pending' },
  ];

  const previousAssignments = [
    { id: 1, title: 'Assignment 1', submittedDate: '2024-11-20', grade: 'A' },
    { id: 2, title: 'Assignment 2', submittedDate: '2024-11-22', grade: 'B+' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Student Dashboard
      </Typography>
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {/* Current Assignments */}
        <Card className="w-full max-w-xl">
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              Current Assignments
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>{assignment.dueDate}</TableCell>
                      <TableCell>{assignment.status}</TableCell>
                      <TableCell>
                        <Link
                          href={`/student/assignments/${assignment.id}`}
                          passHref
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            Submit
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Previous Assignments */}
        <Card className="w-full max-w-xl">
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              Previous Assignments
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Submitted Date</TableCell>
                    <TableCell>Grade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previousAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>{assignment.submittedDate}</TableCell>
                      <TableCell>{assignment.grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentHome;
