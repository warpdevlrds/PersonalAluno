import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { StatCard } from '@/components/StatCard';
import { ArrowLeft, Calendar, ClipboardList, Dumbbell, Trophy } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface StudentDetailsPageProps {
  onNavigate: (path: string, params?: Record<string, string | number>) => void;
}

const dayOrder: Record<string, number> = {
  Segunda: 1,
  Terça: 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  Sábado: 6,
  Domingo: 7,
};

export function StudentDetailsPage({ onNavigate }: StudentDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const { students, workouts, assessments, achievements } = useData();

  const student = students.find(item => item.id === id);

  const studentWorkouts = useMemo(
    () => workouts.filter(workout => workout.studentId === id),
    [workouts, id]
  );

  const studentAssessments = useMemo(
    () =>
      assessments
        .filter(assessment => assessment.studentId === id)
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [assessments, id]
  );

  const studentAchievements = useMemo(
    () =>
      achievements
        .filter(achievement => achievement.studentId === id)
        .sort(
          (a, b) =>
            new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
        ),
    [achievements, id]
  );

  if (!student) {
    return (
      <Card className="p-12 glass-card text-center space-y-6">
        <h2 className="text-2xl font-display font-bold">Aluno não encontrado</h2>
        <p className="text-muted-foreground">
          Não foi possível localizar as informações do aluno selecionado.
        </p>
        <Button onClick={() => onNavigate('/students')} className="btn-neon">
          Voltar para lista de alunos
        </Button>
      </Card>
    );
  }

  const weightTimeline = studentAssessments
    .filter(assessment => typeof assessment.weight === 'number')
    .map(assessment => ({
      date: format(new Date(assessment.date), 'dd/MM', { locale: ptBR }),
      weight: assessment.weight,
    }));

  const sortedWorkouts = [...studentWorkouts].sort((a, b) => {
    if (a.dayOfWeek && b.dayOfWeek && dayOrder[a.dayOfWeek] && dayOrder[b.dayOfWeek]) {
      return dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek];
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate('/students')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-display font-black gradient-text">{student.name}</h1>
              <p className="text-sm text-muted-foreground">{student.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {student.level}
                </Badge>
                <Badge
                  className={
                    student.status === 'active'
                      ? 'bg-neon-lime/20 text-neon-lime border-neon-lime/40'
                      : student.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                      : 'bg-destructive/20 text-destructive border-destructive/40'
                  }
                >
                  {student.status === 'active'
                    ? 'Ativo'
                    : student.status === 'warning'
                    ? 'Atenção'
                    : 'Inativo'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Button className="btn-neon" onClick={() => onNavigate('/create-workout')}>
          Criar novo treino
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Treinos ativos"
          value={studentWorkouts.length}
          icon={Dumbbell}
        />
        <StatCard
          title="Avaliações físicas"
          value={studentAssessments.length}
          icon={ClipboardList}
        />
        <StatCard
          title="Conquistas"
          value={studentAchievements.length}
          icon={Trophy}
        />
        <StatCard
          title="Último acesso"
          value={
            student.lastWorkout
              ? format(new Date(student.lastWorkout), "dd 'de' MMMM", { locale: ptBR })
              : 'Sem registros'
          }
          icon={Calendar}
        />
      </div>

      <Card className="p-6 glass-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold">Objetivo principal</h2>
            <p className="text-muted-foreground">{student.goal}</p>
          </div>
          {studentAssessments.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Última avaliação em{' '}
              {format(
                new Date(studentAssessments[studentAssessments.length - 1].date),
                "dd/MM/yyyy",
                { locale: ptBR }
              )}
            </div>
          )}
        </div>

        {weightTimeline.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightTimeline}>
                <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    borderRadius: '0.75rem',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Ainda não há dados de peso para exibir o gráfico.
          </p>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="p-6 glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Agenda de treinos</h2>
            <Badge variant="outline" className="capitalize">
              {studentWorkouts.length} plano(s)
            </Badge>
          </div>

          {sortedWorkouts.length > 0 ? (
            <div className="space-y-4">
              {sortedWorkouts.map(workout => (
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
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{workout.exercises.length} exercícios</Badge>
                      {workout.estimatedTime && (
                        <Badge variant="outline">~{workout.estimatedTime} min</Badge>
                      )}
                      <Button
                        size="sm"
                        className="btn-neon"
                        onClick={() => onNavigate('/workouts')}
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                  {workout.motivationalMessage && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      “{workout.motivationalMessage}”
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Nenhum treino cadastrado para este aluno ainda.
            </div>
          )}
        </Card>

        <Card className="p-6 glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Conquistas recentes</h2>
            <Button variant="outline" size="sm" onClick={() => onNavigate('/achievements')}>
              Ver todas
            </Button>
          </div>

          {studentAchievements.length > 0 ? (
            <div className="space-y-4">
              {studentAchievements.slice(0, 5).map(achievement => (
                <div key={achievement.id} className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <p className="font-semibold">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(achievement.unlockedAt), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma conquista registrada para este aluno até o momento.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
