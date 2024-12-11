'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success('Logged out successfully');
        router.push('/');
      }
    } catch (error) {
      toast.error('Error logging out');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center space-x-2 text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 py-2 px-6 rounded-lg hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      disabled={isLoading}
    >
      <LogOut className="h-5 w-5" />
      <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
}
