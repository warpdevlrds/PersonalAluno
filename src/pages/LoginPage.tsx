import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dumbbell, User, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'personal' | 'student' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error('Selecione um tipo de perfil');
      return;
    }

    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-5xl space-y-8 animate-slide-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Dumbbell className="h-12 w-12 text-primary animate-pulse" />
            <h1 className="text-5xl font-display font-black gradient-text">
              Personal & Aluno
            </h1>
          </div>
          <p className="text-xl text-muted-foreground neon-glow">
            Treinar ficou simples. Evoluir ficou inevitável.
          </p>
        </div>

        {/* Role Selection */}
        {!selectedRole ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className="p-8 glass-card card-glow cursor-pointer hover:scale-105 transition-all group"
              onClick={() => setSelectedRole('personal')}
            >
              <div className="text-center space-y-4">
                <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary to-neon-lime flex items-center justify-center group-hover:animate-glow">
                  <GraduationCap className="h-12 w-12 text-background" />
                </div>
                <h2 className="text-2xl font-display font-bold">Personal Trainer</h2>
                <p className="text-muted-foreground">
                  Gerencie alunos, crie treinos e acompanhe evolução
                </p>
              </div>
            </Card>

            <Card
              className="p-8 glass-card card-glow cursor-pointer hover:scale-105 transition-all group"
              onClick={() => setSelectedRole('student')}
            >
              <div className="text-center space-y-4">
                <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-accent to-neon-violet flex items-center justify-center group-hover:animate-glow">
                  <User className="h-12 w-12 text-background" />
                </div>
                <h2 className="text-2xl font-display font-bold">Aluno</h2>
                <p className="text-muted-foreground">
                  Acesse seus treinos e acompanhe seu progresso
                </p>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="max-w-md mx-auto p-8 glass-card animate-scale-in">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-display font-bold">
                  {selectedRole === 'personal' ? 'Personal Trainer' : 'Aluno'}
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRole(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Trocar perfil
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-neon bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Demo: use qualquer email e senha
              </p>
            </form>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © 2024 Personal & Aluno. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
