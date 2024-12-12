import Link from 'next/link';
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
      <Link
        href="/students/login"
        className="transition-transform hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95"
      >
        <Card className="transition-colors rounded-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Student Login
            </CardTitle>
            <CardDescription className="text-center">
              Access your assignments and submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-20 items-center justify-center">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link
        href="/marker/login"
        className="transition-transform hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95"
      >
        <Card className="transition-colors rounded-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Teacher Login
            </CardTitle>
            <CardDescription className="text-center">
              Manage assignments and grading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-20 items-center justify-center">
              <Users className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
