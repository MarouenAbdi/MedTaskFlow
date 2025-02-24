import { Bell, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex h-16 items-center border-b px-4 gap-4">
      {children}
      <div className="flex-1">
        <h1 className="text-xl font-semibold md:text-2xl">Webpilot</h1>
      </div>
      <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
        <Bell className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
        <Settings className="h-5 w-5" />
      </Button>
      <ThemeToggle />
    </header>
  );
}