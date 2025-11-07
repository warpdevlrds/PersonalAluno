import { Navigation } from './Navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string, params?: Record<string, string | number>) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ currentPath, onNavigate, isOpen, onClose }: SidebarProps) {
  const handleNavigate = (path: string) => {
    onNavigate(path);
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card/50 backdrop-blur-xl transition-transform duration-200 md:sticky md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full overflow-y-auto p-4">
          <Navigation currentPath={currentPath} onNavigate={handleNavigate} />
        </div>
      </aside>
    </>
  );
}
