import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
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
import { CreateWorkoutPage } from '@/pages/CreateWorkoutPage';
import { WorkoutModePage } from '@/pages/WorkoutModePage';
import { MessagesPage } from '@/pages/MessagesPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SubscriptionPage } from '@/pages/SubscriptionPage';
import { useOnline } from '@/hooks/use-online';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InstallPrompt } from '@/components/InstallPrompt';
import { WifiOff } from 'lucide-react';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState('/');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isOnline = useOnline();

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
      case '/create-workout':
        return <CreateWorkoutPage onNavigate={setCurrentPath} />;
      case '/workout-mode':
        return <WorkoutModePage onNavigate={setCurrentPath} />;
      case '/messages':
        return <MessagesPage onNavigate={setCurrentPath} />;
      case '/progress':
        return <ProgressPage onNavigate={setCurrentPath} />;
      case '/profile':
        return <ProfilePage onNavigate={setCurrentPath} />;
      case '/subscription':
        return <SubscriptionPage onNavigate={setCurrentPath} />;
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
      
      {!isOnline && (
        <Alert className="m-4 border-yellow-500/50 bg-yellow-500/10">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            Você está offline. Algumas funcionalidades podem estar limitadas.
          </AlertDescription>
        </Alert>
      )}
      
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <AppContent />
          <InstallPrompt />
          <Toaster position="top-right" />
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
