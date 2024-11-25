import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

const StudentHome = () => {
  // Mock data for assignments

  // TODO: API CALL
  const currentAssignments = [
    { id: 1, title: 'Assignment 1', dueDate: '2024-12-01', status: 'Pending' },
    { id: 2, title: 'Assignment 2', dueDate: '2024-12-10', status: 'Pending' },
  ];

  const previousAssignments = [
    { id: 1, title: 'Assignment 1', submittedDate: '2024-11-20', grade: 'A' },
    { id: 2, title: 'Assignment 2', submittedDate: '2024-11-22', grade: 'B+' },
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Student Dashboard</h1>
      <div className="row">
        {/* Current Assignments */}
        <div className="col-md-6">
          <h3>Current Assignments</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAssignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.dueDate}</td>
                  <td>{assignment.status}</td>
                  <td>
                    <Link href={`/student/assignments/${assignment.id}`}>
                      <button className="btn btn-primary btn-sm">Submit</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Previous Assignments */}
        <div className="col-md-6">
          <h3>Previous Assignments</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Submitted Date</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {previousAssignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.submittedDate}</td>
                  <td>{assignment.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
