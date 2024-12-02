import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Users } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@repo/ui';

export function LoginCard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
      <Link href="/students/login">
        <motion.div
          whileHover={{
            scale: 1.05,
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
          }}
          whileTap={{ scale: 0.95 }}
          className="transition-transform"
        >
          <Card className="transition-colors hover:bg-muted/50 rounded-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Student Login</CardTitle>
              <CardDescription>
                Access your assignments and submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 items-center justify-center">
                <GraduationCap className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
      <Link href="/marker/login">
        <motion.div
          whileHover={{
            scale: 1.05,
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
          }}
          whileTap={{ scale: 0.95 }}
          className="transition-transform"
        >
          <Card className="transition-colors hover:bg-muted/50 rounded-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Teacher Login</CardTitle>
              <CardDescription>Manage assignments and grading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 items-center justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    </div>
  );
}
