'use client';

import { motion } from 'framer-motion';
import { LoginCard } from 'components/LoginCard';
import { SiteHeader } from 'components/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center space-y-8 py-12 md:py-24 lg:py-32">
          <motion.div
            className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Assignment Submission System
            </h1>
            <p className="max-w-[750px] text-lg text-gray-200 sm:text-xl">
              Access your coursework, submit assignments, and view grades in one
              secure platform.
            </p>
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <LoginCard />
          </motion.div>
        </section>
      </main>
      <footer className="border-t border-gray-300 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 text-center md:flex-row">
          <motion.p
            className="text-sm text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            © {new Date().getFullYear()} University Name. All rights reserved.
          </motion.p>
          <motion.nav
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Link
              href="/privacy"
              className="text-sm text-gray-300 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-300 hover:text-white"
            >
              Terms of Use
            </Link>
          </motion.nav>
        </div>
      </footer>
    </div>
  );
}
