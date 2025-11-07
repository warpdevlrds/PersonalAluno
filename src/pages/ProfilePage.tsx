import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Save, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleLogout = () => {
    logout();
    onNavigate('/');
  };

  return (
    <div className="space-y-6 animate-slide-in max-w-4xl mx-auto">
      <h1 className="text-3xl font-display font-black gradient-text">Meu Perfil</h1>

      <Card className="p-6 glass-card">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl">{user?.name[0]}</AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.role === 'personal' ? 'Personal Trainer' : 'Aluno'}</p>
          </div>
        </div>

        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button onClick={handleSave} className="btn-neon gap-2">
              <Save className="h-4 w-4" /> Salvar Alterações
            </Button>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div>
              <Label>Senha Atual</Label>
              <Input type="password" />
            </div>
            <div>
              <Label>Nova Senha</Label>
              <Input type="password" />
            </div>
            <div>
              <Label>Confirmar Nova Senha</Label>
              <Input type="password" />
            </div>
            <Button className="btn-neon">Alterar Senha</Button>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <p className="text-muted-foreground">Configure suas preferências de notificação</p>
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6 glass-card border-destructive/30">
        <h3 className="text-xl font-bold mb-4">Zona de Perigo</h3>
        <Button onClick={handleLogout} variant="destructive" className="gap-2">
          <LogOut className="h-4 w-4" /> Sair da Conta
        </Button>
      </Card>
    </div>
  );
}
