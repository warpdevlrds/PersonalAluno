import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoginPage } from '@/pages/LoginPage';
import { PersonalDashboard } from '@/pages/PersonalDashboard';
import { StudentDashboard } from '@/pages/StudentDashboard';
import { StudentsPage } from '@/pages/StudentsPage';
import { ExercisesPage } from '@/pages/ExercisesPage';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState('/');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-12 w-12 mx-auto rounded-full bg-primary/20" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return user.role === 'personal' ? (
          <PersonalDashboard onNavigate={setCurrentPath} />
        ) : (
          <StudentDashboard onNavigate={setCurrentPath} />
        );
      case '/students':
        return <StudentsPage onNavigate={setCurrentPath} />;
      case '/exercises':
        return <ExercisesPage />;
      default:
        return user.role === 'personal' ? (
          <PersonalDashboard onNavigate={setCurrentPath} />
        ) : (
          <StudentDashboard onNavigate={setCurrentPath} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex">
        <Sidebar
          currentPath={currentPath}
          onNavigate={setCurrentPath}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
        <Toaster position="top-right" />
      </DataProvider>
    </AuthProvider>
  );
}
