import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { StudentCard } from '@/components/StudentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Search, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { Student } from '@/types';

interface StudentsPageProps {
  onNavigate: (path: string) => void;
}

export function StudentsPage({ onNavigate }: StudentsPageProps) {
  const { students, addStudent } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    level: 'beginner' as Student['level'],
    goal: '',
  });

  const myStudents = students.filter(s => s.personalId === user?.id);

  const filteredStudents = myStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.age || !formData.goal) {
      toast.error('Preencha todos os campos');
      return;
    }

    addStudent({
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      level: formData.level,
      goal: formData.goal,
      status: 'active',
      personalId: user?.id || '',
    });

    toast.success(`${formData.name} foi adicionado com sucesso! 🎉`);
    setIsDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      age: '',
      level: 'beginner',
      goal: '',
    });
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-display font-black gradient-text">
            Meus Alunos
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie e acompanhe todos os seus alunos
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-neon bg-primary hover:bg-primary/90 gap-2">
              <PlusCircle className="h-5 w-5" />
              Adicionar Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">
                Novo Aluno
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="João Silva"
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="joao@email.com"
                  className="bg-secondary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Nível</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: Student['level']) =>
                      setFormData({ ...formData, level: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Objetivo Principal</Label>
                <Input
                  id="goal"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="Hipertrofia, Emagrecimento, etc."
                  className="bg-secondary/50"
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-neon bg-primary hover:bg-primary/90"
              >
                Adicionar Aluno
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar alunos por nome ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary/50"
        />
      </div>

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredStudents.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => onNavigate(`/student/${student.id}`)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 glass-card text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-display font-bold mb-2">
            {searchQuery ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? 'Tente buscar com outros termos'
              : 'Comece adicionando seus primeiros alunos'}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="btn-neon bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Adicionar Primeiro Aluno
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
