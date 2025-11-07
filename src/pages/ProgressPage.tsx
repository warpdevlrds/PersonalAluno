import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Dumbbell, Target } from 'lucide-react';
import { StatCard } from '@/components/StatCard';

interface ProgressPageProps {
  onNavigate: (path: string, params?: Record<string, string | number>) => void;
}

export function ProgressPage({ onNavigate }: ProgressPageProps) {
  const weightData = [
    { date: 'Jan', weight: 75 },
    { date: 'Fev', weight: 74 },
    { date: 'Mar', weight: 73 },
    { date: 'Abr', weight: 72 },
    { date: 'Mai', weight: 71 },
    { date: 'Jun', weight: 70 },
  ];

  const volumeData = [
    { week: 'Sem 1', volume: 5000 },
    { week: 'Sem 2', volume: 5500 },
    { week: 'Sem 3', volume: 6000 },
    { week: 'Sem 4', volume: 6200 },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      <h1 className="text-3xl font-display font-black gradient-text">Meu Progresso</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Peso Atual" value="70kg" icon={TrendingUp} trend={{ value: 5, isPositive: false }} />
        <StatCard title="Treinos/Mês" value="18" icon={Calendar} trend={{ value: 12, isPositive: true }} />
        <StatCard title="Volume Total" value="6.2k" icon={Dumbbell} />
        <StatCard title="Meta Atingida" value="85%" icon={Target} />
      </div>

      <Tabs defaultValue="weight" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weight">Peso</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="measurements">Medidas</TabsTrigger>
        </TabsList>

        <TabsContent value="weight">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold mb-4">Evolução de Peso</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="volume">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold mb-4">Volume de Treino</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="measurements">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold mb-4">Medidas Corporais</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: 'Peito', value: '100cm', change: '+2cm' },
                { label: 'Cintura', value: '80cm', change: '-3cm' },
                { label: 'Braço', value: '38cm', change: '+1cm' },
                { label: 'Coxa', value: '58cm', change: '+2cm' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-sm text-neon-lime">{item.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
