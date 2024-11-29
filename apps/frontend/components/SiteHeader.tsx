import Link from 'next/link';
import { motion } from 'framer-motion';

export function SiteHeader() {
  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 ml-[2rem]">
          <span className="text-xl font-bold text-primary">
            University Portal
          </span>
        </Link>
        <nav className="ml-auto flex items-center space-x-6 mr-[2rem]">
          <motion.div
            whileHover={{ scale: 1.1, color: '#3b82f6' }}
            whileTap={{ scale: 0.95 }}
            className="transition-transform"
          >
            <Link
              href="/help"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Help
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, color: '#3b82f6' }}
            whileTap={{ scale: 0.95 }}
            className="transition-transform"
          >
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </motion.div>
        </nav>
      </div>
    </header>
  );
}
