import { useCallback, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import NotFound from '@/pages/NotFound';
import { StudentDetailsPage } from '@/pages/StudentDetailsPage';
import { WorkoutsPage } from '@/pages/WorkoutsPage';
import { AchievementsPage } from '@/pages/AchievementsPage';

type NavigateHandler = (path: string, params?: Record<string, string | number>) => void;

function AuthenticatedApp() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isOnline = useOnline();

  const handleNavigate = useCallback<NavigateHandler>(
    (path, params) => {
      let target = path;
      if (params) {
        target = Object.entries(params).reduce(
          (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
          target
        );
      }
      navigate(target);
      setIsSidebarOpen(false);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(open => !open)} />

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
          currentPath={location.pathname}
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route
                path="/"
                element={
                  user.role === 'personal' ? (
                    <PersonalDashboard onNavigate={handleNavigate} />
                  ) : (
                    <StudentDashboard onNavigate={handleNavigate} />
                  )
                }
              />
              <Route path="/students" element={<StudentsPage onNavigate={handleNavigate} />} />
              <Route
                path="/student/:id"
                element={<StudentDetailsPage onNavigate={handleNavigate} />}
              />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route
                path="/create-workout"
                element={<CreateWorkoutPage onNavigate={handleNavigate} />}
              />
              <Route
                path="/workout-mode"
                element={<WorkoutModePage onNavigate={handleNavigate} />}
              />
              <Route path="/workouts" element={<WorkoutsPage onNavigate={handleNavigate} />} />
              <Route
                path="/achievements"
                element={<AchievementsPage onNavigate={handleNavigate} />}
              />
              <Route path="/messages" element={<MessagesPage onNavigate={handleNavigate} />} />
              <Route path="/progress" element={<ProgressPage onNavigate={handleNavigate} />} />
              <Route path="/profile" element={<ProfilePage onNavigate={handleNavigate} />} />
              <Route
                path="/subscription"
                element={<SubscriptionPage onNavigate={handleNavigate} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

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

  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppContent />
            <InstallPrompt />
            <Toaster position="top-right" />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
