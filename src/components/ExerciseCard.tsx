import { Exercise } from '@/types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Dumbbell } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
  selected?: boolean;
}

export function ExerciseCard({ exercise, onClick, selected }: ExerciseCardProps) {
  const getDifficultyColor = () => {
    const colors = {
      beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
      intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[exercise.difficulty];
  };

  const getDifficultyLabel = () => {
    const labels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado',
    };
    return labels[exercise.difficulty];
  };

  return (
    <Card
      className={cn(
        'p-4 glass-card cursor-pointer hover:scale-[1.02] transition-all animate-scale-in',
        selected && 'ring-2 ring-primary card-glow',
        !selected && 'hover:border-primary/50'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
          {exercise.gifUrl || exercise.videoUrl ? (
            <div className="h-full w-full rounded-lg bg-muted/50 flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
          ) : (
            <Dumbbell className="h-6 w-6 text-primary" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-base">{exercise.name}</h3>
            {exercise.isCustom && (
              <Badge variant="outline" className="bg-neon-violet/20 text-neon-violet border-neon-violet/30">
                Custom
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {exercise.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {exercise.muscleGroup}
            </Badge>
            <Badge variant="outline" className={getDifficultyColor()}>
              {getDifficultyLabel()}
            </Badge>
          </div>

          {exercise.equipment.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {exercise.equipment.slice(0, 3).map((eq, index) => (
                <span key={index} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {eq}
                </span>
              ))}
              {exercise.equipment.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{exercise.equipment.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
