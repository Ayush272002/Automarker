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

export default function StudentSignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/signup`,
        {
          firstName,
          lastName,
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success('User signed up successfully');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while signing up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-800 via-purple-600 to-pink-600">
      <Link
        href="/"
        className="absolute left-4 top-4 text-sm text-gray-300 hover:text-white transition-colors md:left-8 md:top-8 group"
      >
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center my-2"
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
                Student Signup
              </CardTitle>
              <CardDescription className="text-center text-gray-200">
                Create your student account below
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
                  <Label htmlFor="first-name" className="text-gray-200">
                    First Name
                  </Label>
                  <Input
                    id="first-name"
                    placeholder="Enter your first name"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-400 rounded-md"
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="last-name" className="text-gray-200">
                    Last Name
                  </Label>
                  <Input
                    id="last-name"
                    placeholder="Enter your last name"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-400 rounded-md"
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-400 rounded-md"
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
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-400 rounded-md"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-200">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Enter your password again"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-500 focus:ring-pink-400"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition-all hover:shadow-pink-500/50 rounded-md"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Signing Up...
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Sign Up
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
                href="/students/login"
                className="text-gray-200 hover:text-white transition-colors hover:underline"
              >
                Already have an account? Log in here
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
