import { useMemo } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/StatCard';
import { Calendar, Clock, Flame, ListChecks, Play } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from 'recharts';

interface WorkoutsPageProps {
  onNavigate: (path: string, params?: Record<string, string | number>) => void;
}

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export function WorkoutsPage({ onNavigate }: WorkoutsPageProps) {
  const { user } = useAuth();
  const { workouts, workoutLogs, students } = useData();

  const relevantWorkouts = useMemo(() => {
    if (!user) return [];
    return user.role === 'personal'
      ? workouts.filter(workout => workout.personalId === user.id)
      : workouts.filter(workout => workout.studentId === user.id);
  }, [user, workouts]);

  const relevantLogs = useMemo(() => {
    if (!user) return [];
    return workoutLogs
      .filter(log =>
        user.role === 'personal'
          ? relevantWorkouts.some(workout => workout.id === log.workoutId)
          : log.studentId === user.id
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [user, workoutLogs, relevantWorkouts]);

  const upcomingWorkouts = useMemo(() => {
    return relevantWorkouts
      .slice()
      .sort((a, b) => {
        const orderA = a.dayOfWeek ? weekDays.indexOf(a.dayOfWeek) : 99;
        const orderB = b.dayOfWeek ? weekDays.indexOf(b.dayOfWeek) : 99;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }, [relevantWorkouts]);

  const scheduleData = useMemo(
    () =>
      weekDays.map(day => {
        const dayWorkouts = relevantWorkouts.filter(workout => workout.dayOfWeek === day);
        const totalMinutes = dayWorkouts.reduce(
          (acc, workout) => acc + (workout.estimatedTime ?? 45),
          0
        );
        return {
          day,
          treinos: dayWorkouts.length,
          minutos: totalMinutes,
        };
      }),
    [relevantWorkouts]
  );

  const volumeTimeline = useMemo(
    () =>
      relevantLogs.slice(0, 7).reverse().map(log => ({
        date: format(new Date(log.date), 'dd/MM', { locale: ptBR }),
        volume: log.exercises.reduce((total, exercise) => {
          return (
            total +
            exercise.sets.reduce((acc, set) => acc + (set.weight ?? 0) * set.reps, 0)
          );
        }, 0),
        duracao: log.duration,
      })),
    [relevantLogs]
  );

  const totalMinutes = relevantWorkouts.reduce(
    (acc, workout) => acc + (workout.estimatedTime ?? 45),
    0
  );

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-display font-black gradient-text">
            {user?.role === 'personal' ? 'Agenda de Treinos' : 'Meus Treinos'}
          </h1>
          <p className="text-muted-foreground">
            Visualize os planos, acompanhe execuções e mantenha a constância.
          </p>
        </div>
        {user?.role === 'personal' && (
          <Button className="btn-neon" onClick={() => onNavigate('/create-workout')}>
            Criar novo plano
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Planos ativos" value={relevantWorkouts.length} icon={ListChecks} />
        <StatCard title="Sessões concluídas" value={relevantLogs.length} icon={Flame} />
        <StatCard title="Tempo semanal" value={`${totalMinutes} min`} icon={Clock} />
        <StatCard
          title="Dias com treinos"
          value={scheduleData.filter(item => item.treinos > 0).length}
          icon={Calendar}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="p-6 glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Linha do tempo de treinos</h2>
            <Badge variant="outline">{upcomingWorkouts.length} planos</Badge>
          </div>

          {upcomingWorkouts.length > 0 ? (
            <div className="space-y-4">
              {upcomingWorkouts.map(workout => {
                const relatedStudent = students.find(student => student.id === workout.studentId);
                return (
                  <div
                    key={workout.id}
                    className="p-4 rounded-xl bg-secondary/40 border border-secondary/60 hover:border-primary/40 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-display font-semibold">{workout.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {workout.dayOfWeek ||
                            `Criado em ${format(new Date(workout.createdAt), 'dd/MM', { locale: ptBR })}`}
                        </p>
                        {user?.role === 'personal' && relatedStudent && (
                          <Button
                            variant="link"
                            className="px-0 text-sm"
                            onClick={() => onNavigate('/student/:id', { id: relatedStudent.id })}
                          >
                            Ver aluno: {relatedStudent.name}
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge variant="secondary">{workout.exercises.length} exercícios</Badge>
                        {workout.estimatedTime && (
                          <Badge variant="outline">~{workout.estimatedTime} min</Badge>
                        )}
                        <Button
                          size="sm"
                          className="btn-neon"
                          onClick={() => onNavigate('/workout-mode')}
                        >
                          <Play className="h-4 w-4 mr-1" /> Iniciar
                        </Button>
                      </div>
                    </div>
                    {workout.description && (
                      <p className="mt-3 text-sm text-muted-foreground">{workout.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum treino cadastrado por enquanto.</p>
          )}
        </Card>

        <Card className="p-6 glass-card space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-bold">Distribuição semanal</h2>
            <p className="text-sm text-muted-foreground">
              Volume de sessões e tempo médio planejado por dia.
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scheduleData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    borderRadius: '0.75rem',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="treinos" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 glass-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Histórico recente</h2>
          <Badge variant="outline">{relevantLogs.length} sessões registradas</Badge>
        </div>

        {relevantLogs.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {relevantLogs.slice(0, 6).map(log => {
              const relatedWorkout = relevantWorkouts.find(workout => workout.id === log.workoutId);
              const relatedStudent = students.find(student => student.id === log.studentId);
              return (
                <Card key={log.id} className="p-4 bg-background/80 border border-border/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {relatedWorkout?.name ?? 'Treino'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.date), "dd 'de' MMMM", { locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant="secondary">{log.duration} min</Badge>
                  </div>
                  {user?.role === 'personal' && relatedStudent && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Aluno: {relatedStudent.name}
                    </p>
                  )}
                  <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                    {log.exercises.slice(0, 3).map(exercise => (
                      <div key={exercise.exerciseId}>
                        • {exercise.sets.length} série(s) registradas
                      </div>
                    ))}
                    {log.exercises.length > 3 && <div>…</div>}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">Sem registros de treinos concluídos ainda.</p>
        )}
      </Card>

      {volumeTimeline.length > 0 && (
        <Card className="p-6 glass-card space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-bold">Volume x Duração</h2>
            <p className="text-sm text-muted-foreground">
              Acompanhe a evolução das últimas sessões concluídas.
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeTimeline}>
                <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.2} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    borderRadius: '0.75rem',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="volume"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  name="Volume"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="duracao"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Duração (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
