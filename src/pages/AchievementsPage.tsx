import { useMemo } from 'react';
import { format, isAfter, subDays } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Users, Medal } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts';

interface AchievementsPageProps {
  onNavigate: (path: string, params?: Record<string, string | number>) => void;
}

export function AchievementsPage({ onNavigate }: AchievementsPageProps) {
  const { user } = useAuth();
  const { achievements, challenges, students } = useData();

  const filteredAchievements = useMemo(() => {
    if (!user) return [];
    return user.role === 'personal'
      ? achievements
      : achievements.filter(achievement => achievement.studentId === user.id);
  }, [user, achievements]);

  const activeChallenges = useMemo(() => {
    if (!user) return [];
    return challenges.filter(challenge =>
      user.role === 'personal'
        ? challenge.personalId === user.id
        : challenge.studentIds.includes(user.id)
    );
  }, [user, challenges]);

  const achievementTimeline = useMemo(() => {
    const monthlyTotals = filteredAchievements.reduce((acc, achievement) => {
      const key = format(new Date(achievement.unlockedAt), 'yyyy-MM');
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyTotals)
      .sort(
        ([monthA], [monthB]) =>
          new Date(`${monthA}-01`).getTime() - new Date(`${monthB}-01`).getTime()
      )
      .map(([month, total]) => ({
        month: format(new Date(`${month}-01`), 'MMM', { locale: ptBR }),
        total,
      }));
  }, [filteredAchievements]);

  const achievementsByStudent = useMemo(() => {
    return filteredAchievements.reduce((acc, achievement) => {
      const key = achievement.studentId;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredAchievements]);

  const recentAchievements = useMemo(
    () =>
      filteredAchievements
        .slice()
        .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()),
    [filteredAchievements]
  );

  const lastThirtyDays = filteredAchievements.filter(achievement =>
    isAfter(new Date(achievement.unlockedAt), subDays(new Date(), 30))
  );

  const totalStudentsImpacted = Object.keys(achievementsByStudent).length;

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-black gradient-text">Conquistas & Desafios</h1>
        <p className="text-muted-foreground">
          Acompanhe a evolução dos alunos, desafios ativos e conquistas desbloqueadas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Conquistas totais" value={filteredAchievements.length} icon={Trophy} />
        <StatCard title="Últimos 30 dias" value={lastThirtyDays.length} icon={Medal} />
        <StatCard title="Desafios ativos" value={activeChallenges.length} icon={Target} />
        <StatCard title="Alunos impactados" value={totalStudentsImpacted} icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="p-6 glass-card space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-display font-bold">Linha do tempo de conquistas</h2>
            <p className="text-sm text-muted-foreground">
              Número total de conquistas desbloqueadas ao longo dos meses.
            </p>
          </div>
          {achievementTimeline.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={achievementTimeline}>
                  <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.2} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      borderRadius: '0.75rem',
                      border: '1px solid hsl(var(--border))',
                    }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#22d3ee" fill="#22d3ee33" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Sem conquistas registradas ainda. Continue acompanhando seus resultados!
            </p>
          )}
        </Card>

        <Card className="p-6 glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Ranking de alunos</h2>
            <Badge variant="outline">Top {Math.min(5, totalStudentsImpacted)}</Badge>
          </div>
          {totalStudentsImpacted > 0 ? (
            <div className="space-y-3">
              {Object.entries(achievementsByStudent)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([studentId, total]) => {
                  const student = students.find(item => item.id === studentId);
                  return (
                    <Button
                      key={studentId}
                      variant="ghost"
                      className="w-full justify-between bg-secondary/30 hover:bg-secondary/50"
                      onClick={() => onNavigate('/student/:id', { id: studentId })}
                    >
                      <span className="flex flex-col items-start">
                        <span className="font-semibold">{student?.name ?? 'Aluno'}</span>
                        <span className="text-xs text-muted-foreground">{total} conquista(s)</span>
                      </span>
                      <Trophy className="h-4 w-4 text-primary" />
                    </Button>
                  );
                })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhum aluno acumulou conquistas até o momento.
            </p>
          )}
        </Card>
      </div>

      <Card className="p-6 glass-card space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-bold">Distribuição por tipo de desafio</h2>
          <p className="text-sm text-muted-foreground">
            Veja como os desafios estão distribuídos entre individuais e coletivos.
          </p>
        </div>
        {activeChallenges.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={['individual', 'collective'].map(type => ({
                  tipo: type === 'individual' ? 'Individual' : 'Coletivo',
                  total: activeChallenges.filter(challenge => challenge.type === type).length,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="tipo" stroke="hsl(var(--muted-foreground))" />
                <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    borderRadius: '0.75rem',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="total" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum desafio ativo no momento. Que tal iniciar um novo?
          </p>
        )}
      </Card>

      <Card className="p-6 glass-card space-y-4">
        <h2 className="text-2xl font-display font-bold">Linha do tempo detalhada</h2>
        {recentAchievements.length > 0 ? (
          <div className="space-y-4">
            {recentAchievements.map(achievement => {
              const student = students.find(item => item.id === achievement.studentId);
              return (
                <div
                  key={achievement.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-secondary/60 bg-secondary/30 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div>
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(achievement.unlockedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  {student && (
                    <Button
                      variant="outline"
                      onClick={() => onNavigate('/student/:id', { id: student.id })}
                    >
                      Ver ficha de {student.name}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">Você ainda não desbloqueou conquistas.</p>
        )}
      </Card>
    </div>
  );
}
