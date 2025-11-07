import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Play, Pause, SkipForward, X } from 'lucide-react';
import { toast } from 'sonner';

interface WorkoutModePageProps {
  onNavigate: (path: string, params?: Record<string, string | number>) => void;
}

export function WorkoutModePage({ onNavigate }: WorkoutModePageProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);

  const exercises = [
    { name: 'Supino Reto', sets: 4, reps: '12', rest: 60 },
    { name: 'Supino Inclinado', sets: 4, reps: '12', rest: 60 },
    { name: 'Crucifixo', sets: 3, reps: '15', rest: 45 },
    { name: 'Tríceps Testa', sets: 4, reps: '12', rest: 60 },
    { name: 'Tríceps Corda', sets: 3, reps: '15', rest: 45 },
  ];

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets = exercises.slice(0, currentExercise).reduce((acc, ex) => acc + ex.sets, 0) + currentSet;
  const progress = (completedSets / totalSets) * 100;

  const nextSet = () => {
    if (currentSet < exercises[currentExercise].sets - 1) {
      setCurrentSet(currentSet + 1);
      setIsResting(true);
      setRestTime(exercises[currentExercise].rest);
    } else if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setCurrentSet(0);
      setIsResting(true);
      setRestTime(exercises[currentExercise + 1].rest);
    } else {
      toast.success('Treino concluído! 🎉');
      onNavigate('/');
    }
  };

  const finishWorkout = () => {
    if (confirm('Deseja finalizar o treino?')) {
      toast.success('Treino salvo com sucesso!');
      onNavigate('/');
    }
  };

  return (
    <div className="space-y-6 animate-slide-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-black gradient-text">Modo Treino</h1>
        <Button variant="ghost" size="icon" onClick={finishWorkout}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Card className="p-6 glass-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-neon-lime/20 text-neon-lime border-neon-lime/50">
              Exercício {currentExercise + 1} de {exercises.length}
            </Badge>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      <Card className="p-8 glass-card gradient-border">
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-display font-black">{exercises[currentExercise].name}</h2>
          
          <div className="flex items-center justify-center gap-8">
            <div>
              <p className="text-sm text-muted-foreground">Série</p>
              <p className="text-3xl font-bold">{currentSet + 1}/{exercises[currentExercise].sets}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Repetições</p>
              <p className="text-3xl font-bold">{exercises[currentExercise].reps}</p>
            </div>
          </div>

          {isResting ? (
            <div className="space-y-4">
              <p className="text-6xl font-bold text-neon-lime">{restTime}s</p>
              <p className="text-muted-foreground">Descansando...</p>
              <Button onClick={() => setIsResting(false)} className="btn-neon gap-2">
                <SkipForward className="h-5 w-5" /> Pular Descanso
              </Button>
            </div>
          ) : (
            <Button onClick={nextSet} size="lg" className="btn-neon gap-2 text-lg px-8 py-6">
              <CheckCircle2 className="h-6 w-6" /> Série Completa
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-4 glass-card">
        <div className="space-y-2">
          {exercises.map((ex, idx) => (
            <div key={idx} className={`flex items-center gap-3 p-2 rounded ${idx === currentExercise ? 'bg-primary/10' : ''}`}>
              {idx < currentExercise ? (
                <CheckCircle2 className="h-5 w-5 text-neon-lime" />
              ) : idx === currentExercise ? (
                <Play className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={idx === currentExercise ? 'font-bold' : 'text-muted-foreground'}>{ex.name}</span>
              <span className="ml-auto text-sm text-muted-foreground">{ex.sets}x{ex.reps}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
