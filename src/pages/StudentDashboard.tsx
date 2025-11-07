import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Target, Trophy, Calendar, Play, CheckCircle2 } from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (path: string, params?: Record<string, string | number>) => void;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { workouts, workoutLogs, achievements } = useData();
  const { user } = useAuth();

  // Mock data for student stats
  const thisWeekWorkouts = 4;
  const totalWorkouts = 20;
  const currentStreak = 5;
  const myAchievements = achievements.filter(a => a.studentId === user?.id);

  const todayWorkout = workouts[0]; // Mock today's workout

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-black gradient-text">
          Pronto para evoluir? 🔥
        </h1>
        <p className="text-lg text-muted-foreground">
          Você está indo muito bem! Continue assim.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Treinos esta Semana"
          value={`${thisWeekWorkouts}/5`}
          icon={Calendar}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Sequência Atual"
          value={`${currentStreak} dias`}
          icon={Flame}
          className="border-neon-lime/30"
        />
        <StatCard
          title="Total de Treinos"
          value={totalWorkouts}
          icon={Target}
        />
        <StatCard
          title="Conquistas"
          value={myAchievements.length}
          icon={Trophy}
          className="border-neon-violet/30"
        />
      </div>

      {/* Today's Workout */}
      {todayWorkout ? (
        <Card className="p-8 glass-card gradient-border">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Badge className="bg-neon-lime/20 text-neon-lime border-neon-lime/50">
                  Treino de Hoje
                </Badge>
                <h2 className="text-3xl font-display font-black">
                  {todayWorkout.name || 'Treino A - Peito e Tríceps'}
                </h2>
                <p className="text-muted-foreground">
                  5 exercícios • ~45 minutos
                </p>
              </div>
              <Button
                size="lg"
                className="btn-neon bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2"
                onClick={() => onNavigate('/workout-mode')}
              >
                <Play className="h-5 w-5" />
                Iniciar Treino
              </Button>
            </div>

            <div className="grid gap-3">
              {['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Tríceps Testa', 'Tríceps Corda'].map((exercise, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{exercise}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    4x12
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-12 glass-card text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-display font-bold mb-2">Nenhum treino para hoje</h3>
          <p className="text-muted-foreground">
            Seu personal ainda não definiu um treino para você
          </p>
        </Card>
      )}

      {/* Progress This Week */}
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold">Progresso Semanal</h2>
        <div className="grid gap-3">
          {[
            { day: 'Segunda', done: true, workout: 'Treino A' },
            { day: 'Terça', done: true, workout: 'Treino B' },
            { day: 'Quarta', done: false, workout: 'Descanso' },
            { day: 'Quinta', done: true, workout: 'Treino C' },
            { day: 'Sexta', done: true, workout: 'Treino D' },
            { day: 'Sábado', done: false, workout: 'Treino E' },
            { day: 'Domingo', done: false, workout: 'Descanso' },
          ].map((item, index) => (
            <Card
              key={index}
              className={`p-4 glass-card ${
                item.done ? 'border-neon-lime/30 bg-neon-lime/5' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      item.done
                        ? 'bg-neon-lime/20 text-neon-lime'
                        : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    {item.done ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                  </div>
                  <div>
                    <p className="font-bold">{item.day}</p>
                    <p className="text-sm text-muted-foreground">{item.workout}</p>
                  </div>
                </div>
                {item.done && (
                  <Badge className="bg-neon-lime/20 text-neon-lime border-neon-lime/50">
                    Concluído
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      {myAchievements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Conquistas Recentes</h2>
            <Button
              variant="outline"
              onClick={() => onNavigate('/achievements')}
              className="btn-neon"
            >
              Ver Todas
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {myAchievements.slice(0, 3).map(achievement => (
              <Card
                key={achievement.id}
                className="p-6 glass-card card-glow text-center animate-scale-in"
              >
                <div className="text-5xl mb-3">{achievement.icon}</div>
                <h3 className="font-display font-bold mb-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className="p-6 glass-card card-glow cursor-pointer hover:scale-105 transition-all"
          onClick={() => onNavigate('/workouts')}
        >
          <Calendar className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-display font-bold mb-2">Meus Treinos</h3>
          <p className="text-sm text-muted-foreground">
            Veja todos os seus treinos
          </p>
        </Card>

        <Card
          className="p-6 glass-card card-glow cursor-pointer hover:scale-105 transition-all"
          onClick={() => onNavigate('/progress')}
        >
          <Trophy className="h-8 w-8 text-accent mb-3" />
          <h3 className="font-display font-bold mb-2">Meu Progresso</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe sua evolução
          </p>
        </Card>
      </div>
    </div>
  );
}
