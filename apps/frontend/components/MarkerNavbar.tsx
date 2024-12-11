import { CheckSquare, ClipboardList, FileCheck, User } from 'lucide-react';
import { toast } from 'react-toastify';

const MarkerNavbar = () => {
  const onClickHandler = () => {
    toast.error('Feature coming soon!');
  };
  return (
    <div>
      <div className="flex items-center space-x-3">
        <ClipboardList className="h-6 w-6 text-blue-400" />
        <h1 className="text-xl font-bold">Marker Dashboard</h1>
      </div>

      <nav className="mt-6 space-y-4">
        <div
          className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer"
          onClick={onClickHandler}
        >
          <ClipboardList className="h-5 w-5" />
          <span>Dashboard</span>
        </div>
        <div
          className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer"
          onClick={onClickHandler}
        >
          <FileCheck className="h-5 w-5" />
          <span>Courses</span>
        </div>
        <div
          className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer"
          onClick={onClickHandler}
        >
          <CheckSquare className="h-5 w-5" />
          <span>Submissions</span>
        </div>
        <div
          className="flex items-center space-x-2 hover:text-blue-400 cursor-pointer"
          onClick={onClickHandler}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </div>
      </nav>
    </div>
  );
};

export default MarkerNavbar;
