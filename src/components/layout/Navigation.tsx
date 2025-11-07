import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  Dumbbell, 
  PlusCircle, 
  MessageCircle, 
  BarChart3,
  User,
  Trophy,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  role?: 'personal' | 'student';
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: Users, label: 'Alunos', path: '/students', role: 'personal' },
  { icon: Dumbbell, label: 'Exercícios', path: '/exercises', role: 'personal' },
  { icon: PlusCircle, label: 'Criar Treino', path: '/create-workout', role: 'personal' },
  { icon: Calendar, label: 'Meus Treinos', path: '/workouts', role: 'student' },
  { icon: BarChart3, label: 'Progresso', path: '/progress', role: 'student' },
  { icon: Trophy, label: 'Conquistas', path: '/achievements', role: 'student' },
  { icon: MessageCircle, label: 'Mensagens', path: '/messages' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  className?: string;
}

export function Navigation({ currentPath, onNavigate, className }: NavigationProps) {
  const { user } = useAuth();

  const filteredItems = navItems.filter(
    item => !item.role || item.role === user?.role
  );

  return (
    <nav className={cn('space-y-1', className)}>
      {filteredItems.map(item => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;

        return (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              'hover:bg-secondary/50',
              isActive && 'bg-primary/10 text-primary border-l-4 border-primary',
              !isActive && 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
