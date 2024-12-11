import { CalendarDays, ClipboardList, Home, User } from 'lucide-react';
import React from 'react';
import { toast } from 'react-toastify';

const StudentNavbar = () => {
  const onClickHandler = () => {
    toast.error('This feature is not available yet.');
  };

  return (
    <div>
      <div className="flex items-center space-x-3">
        <Home className="h-6 w-6 text-blue-400" />
        <h1 className="text-xl font-bold">Student Dashboard</h1>
      </div>
      <nav className="mt-6 space-y-4">
        <div
          onClick={onClickHandler}
          className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer"
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </div>
        <div
          onClick={onClickHandler}
          className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer"
        >
          <ClipboardList className="h-5 w-5" />
          <span>My Courses</span>
        </div>
        <div
          onClick={onClickHandler}
          className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer"
        >
          <CalendarDays className="h-5 w-5" />
          <span>Calendar</span>
        </div>
        <div
          onClick={onClickHandler}
          className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer"
        >
          <User className="h-5 w-5" />
          <span>Grades</span>
        </div>
      </nav>
    </div>
  );
};

export default StudentNavbar;
