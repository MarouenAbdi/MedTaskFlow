import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Sheet, SheetContent } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Menu, Search, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NotificationsMenu } from './notifications-menu';
import { SettingsDialog } from './modals/settings-dialog';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-background md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex w-full flex-col">
        {/* Navbar */}
        <div className="flex h-[60px] items-center border-b px-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar */}
          <div className="flex flex-1 items-center gap-2 px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('common.search')}
              className="w-full max-w-md"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <NotificationsMenu />
            <SettingsDialog />
            <Button variant="ghost" size="icon" asChild>
              <Link to="/login">
                <LogOut className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}