import { Student } from '@/types';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
}

export function StudentCard({ student, onClick }: StudentCardProps) {
  const getStatusBadge = () => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'status-active' },
      warning: { label: 'Atenção', className: 'status-warning' },
      inactive: { label: 'Parado', className: 'status-inactive' },
    };

    const config = statusConfig[student.status];
    return (
      <Badge variant="outline" className={cn('border', config.className)}>
        {config.label}
      </Badge>
    );
  };

  const getLevelBadge = () => {
    const levelConfig = {
      beginner: { label: 'Iniciante', color: 'bg-blue-500/20 text-blue-400' },
      intermediate: { label: 'Intermediário', color: 'bg-yellow-500/20 text-yellow-400' },
      advanced: { label: 'Avançado', color: 'bg-purple-500/20 text-purple-400' },
    };

    const config = levelConfig[student.level];
    return (
      <Badge variant="outline" className={cn('border-0', config.color)}>
        {config.label}
      </Badge>
    );
  };

  const getLastWorkoutText = () => {
    if (!student.lastWorkout) return 'Nenhum treino';

    const now = new Date();
    const diff = now.getTime() - student.lastWorkout.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Treinou hoje';
    if (days === 1) return 'Treinou ontem';
    return `Há ${days} dias`;
  };

  return (
    <Card
      className="p-6 glass-card card-glow cursor-pointer hover:scale-[1.02] transition-transform animate-scale-in"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarImage src={student.avatar} alt={student.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
            {student.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-lg">{student.name}</h3>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
            {getStatusBadge()}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {getLevelBadge()}
            <Badge variant="outline" className="bg-muted/50">
              {student.age} anos
            </Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              {student.goal}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <Clock className="h-4 w-4" />
            <span>{getLastWorkoutText()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
