import Link from 'next/link';
import { toast } from 'react-toastify';

export function SiteHeader() {
  return (
    <header className="w-full border-b bg-background">
      <div className="flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 ml-[2rem]">
          <span className="text-xl font-bold text-primary">
            University Portal
          </span>
        </Link>
        <nav className="ml-auto flex items-center space-x-6 mr-[2rem]">
          <div
            className="transition-all text-sm text-muted-foreground hover:text-primary hover:scale-110 hover:text-[#3b82f6] active:scale-95 cursor-pointer"
            onClick={() => toast.error('Feature coming soon.')}
          >
            Help
          </div>
          <div
            className="transition-all text-sm text-muted-foreground hover:text-primary hover:scale-110 hover:text-[#3b82f6] active:scale-95 cursor-pointer"
            onClick={() => toast.error('Feature coming soon.')}
          >
            Contact
          </div>
        </nav>
      </div>
    </header>
  );
}
