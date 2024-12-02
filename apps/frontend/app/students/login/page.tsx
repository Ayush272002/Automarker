'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@repo/ui';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function StudentLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success('Logged in successfully');
        router.push('/students/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-800 via-purple-600 to-pink-600">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"
      />

      <Link
        href="/"
        className="absolute left-4 top-4 text-sm text-gray-300 hover:text-white transition-colors md:left-8 md:top-8 group"
      >
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </motion.div>
      </Link>

      <motion.div
        className="relative w-full max-w-md mx-auto p-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.7 }}
      >
        <Card className="backdrop-blur-xl bg-white/20 border-gray-400/30 shadow-xl rounded-xl">
          <CardHeader className="space-y-1 pb-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
                Student Login
              </CardTitle>
              <CardDescription className="text-center text-gray-200">
                Enter your student credentials to access your account
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.form
              variants={formVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
            >
              <div className="space-y-4">
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email-id" className="text-gray-200">
                    Email ID
                  </Label>
                  <Input
                    id="email-id"
                    placeholder="Enter your email ID"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-40"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-40"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition-all hover:shadow-pink-500/50"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Signing In...
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Sign In
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.form>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              className="mt-4 text-center text-sm"
            >
              <Link
                href="/forgot-password"
                className="text-gray-200 hover:text-white transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </motion.div>
          </CardContent>
        </Card>

        <motion.p
          className="text-center text-sm text-gray-300 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/students/signup"
            className="text-pink-300 hover:text-pink-200 transition-colors hover:underline"
          >
            Register here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
