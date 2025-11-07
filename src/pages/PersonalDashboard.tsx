import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/StatCard';
import { StudentCard } from '@/components/StudentCard';
import { Users, Dumbbell, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PersonalDashboardProps {
  onNavigate: (path: string, params?: Record<string, string | number>) => void;
}

export function PersonalDashboard({ onNavigate }: PersonalDashboardProps) {
  const { students, workouts } = useData();
  const { user } = useAuth();

  const myStudents = students.filter(s => s.personalId === user?.id);
  const activeStudents = myStudents.filter(s => s.status === 'active').length;
  const warningStudents = myStudents.filter(s => s.status === 'warning');
  const totalWorkouts = workouts.filter(w => w.personalId === user?.id).length;

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-black gradient-text">
          Bem-vindo de volta! 💪
        </h1>
        <p className="text-lg text-muted-foreground">
          Aqui está o resumo do seu dia profissional
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Alunos"
          value={myStudents.length}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Alunos Ativos"
          value={activeStudents}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Treinos Criados"
          value={totalWorkouts}
          icon={Dumbbell}
        />
        <StatCard
          title="Alunos com Atenção"
          value={warningStudents.length}
          icon={AlertCircle}
          className="border-neon-yellow/30"
        />
      </div>

      {/* Alerts */}
      {warningStudents.length > 0 && (
        <Card className="p-6 glass-card border-neon-yellow/30 bg-neon-yellow/5">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-neon-yellow flex-shrink-0 mt-1" />
            <div className="space-y-2 flex-1">
              <h3 className="font-display font-bold text-lg">Alunos precisando de atenção</h3>
              <p className="text-sm text-muted-foreground">
                {warningStudents.length} {warningStudents.length === 1 ? 'aluno está' : 'alunos estão'} sem treinar há mais de 2 dias
              </p>
              <div className="flex flex-wrap gap-2">
                {warningStudents.map(student => (
                  <Button
                    key={student.id}
                    variant="outline"
                    size="sm"
                  onClick={() => onNavigate('/student/:id', { id: student.id })}
                    className="border-neon-yellow/50 hover:bg-neon-yellow/10"
                  >
                    {student.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Students */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Seus Alunos</h2>
          <Button
            variant="outline"
            onClick={() => onNavigate('/students')}
            className="btn-neon"
          >
            Ver Todos
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {myStudents.slice(0, 4).map(student => (
            <StudentCard
              key={student.id}
              student={student}
            onClick={() => onNavigate('/student/:id', { id: student.id })}
            />
          ))}
        </div>

        {myStudents.length === 0 && (
          <Card className="p-12 glass-card text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-display font-bold mb-2">Nenhum aluno cadastrado</h3>
            <p className="text-muted-foreground mb-6">
              Comece adicionando seus primeiros alunos
            </p>
            <Button
              onClick={() => onNavigate('/students')}
              className="btn-neon bg-primary hover:bg-primary/90"
            >
              Adicionar Aluno
            </Button>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className="p-6 glass-card card-glow cursor-pointer hover:scale-105 transition-all"
            onClick={() => onNavigate('/exercises')}
          >
            <Dumbbell className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-display font-bold mb-2">Biblioteca de Exercícios</h3>
            <p className="text-sm text-muted-foreground">
              Acesse e gerencie exercícios
            </p>
          </Card>

          <Card
            className="p-6 glass-card card-glow cursor-pointer hover:scale-105 transition-all"
            onClick={() => onNavigate('/create-workout')}
          >
            <TrendingUp className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-display font-bold mb-2">Criar Novo Treino</h3>
            <p className="text-sm text-muted-foreground">
              Monte treinos personalizados
            </p>
          </Card>

          <Card
            className="p-6 glass-card card-glow cursor-pointer hover:scale-105 transition-all"
            onClick={() => onNavigate('/messages')}
          >
            <Users className="h-8 w-8 text-neon-violet mb-3" />
            <h3 className="font-display font-bold mb-2">Mensagens</h3>
            <p className="text-sm text-muted-foreground">
              Converse com seus alunos
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
