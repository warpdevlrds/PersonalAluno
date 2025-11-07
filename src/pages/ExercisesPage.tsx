import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { ExerciseCard } from '@/components/ExerciseCard';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Search, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';
import type { Exercise } from '@/types';

export function ExercisesPage() {
  const { exercises, addExercise } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    muscleGroup: '',
    difficulty: 'beginner' as Exercise['difficulty'],
    equipment: '',
  });

  const muscleGroups = ['all', ...Array.from(new Set(exercises.map(e => e.muscleGroup)))];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscleGroup =
      selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup;
    return matchesSearch && matchesMuscleGroup;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.muscleGroup) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    addExercise({
      name: formData.name,
      description: formData.description,
      muscleGroup: formData.muscleGroup,
      difficulty: formData.difficulty,
      equipment: formData.equipment.split(',').map(e => e.trim()).filter(Boolean),
      instructions: [],
      tips: [],
      commonMistakes: [],
      isCustom: true,
    });

    toast.success(`${formData.name} foi adicionado! 💪`);
    setIsDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      muscleGroup: '',
      difficulty: 'beginner',
      equipment: '',
    });
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-display font-black gradient-text">
            Biblioteca de Exercícios
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore, gerencie e crie exercícios personalizados
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-neon bg-primary hover:bg-primary/90 gap-2">
              <PlusCircle className="h-5 w-5" />
              Criar Exercício
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">
                Novo Exercício Personalizado
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Exercício</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Rosca Martelo"
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o exercício..."
                  className="bg-secondary/50"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="muscleGroup">Grupo Muscular</Label>
                  <Input
                    id="muscleGroup"
                    value={formData.muscleGroup}
                    onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                    placeholder="Ex: Bíceps"
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: Exercise['difficulty']) =>
                      setFormData({ ...formData, difficulty: value })
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
                <Label htmlFor="equipment">Equipamentos (separados por vírgula)</Label>
                <Input
                  id="equipment"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  placeholder="Halteres, Banco"
                  className="bg-secondary/50"
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-neon bg-primary hover:bg-primary/90"
              >
                Criar Exercício
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar exercícios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>

        <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
          <SelectTrigger className="w-[200px] bg-secondary/50">
            <SelectValue placeholder="Grupo Muscular" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {muscleGroups.slice(1).map(group => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={() => setSelectedExercise(exercise)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 glass-card text-center">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-display font-bold mb-2">
            Nenhum exercício encontrado
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou criar um novo exercício
          </p>
        </Card>
      )}

      {/* Exercise Details Dialog */}
      {selectedExercise && (
        <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
          <DialogContent className="glass-card max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">
                {selectedExercise.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <p className="text-muted-foreground">{selectedExercise.description}</p>

              {selectedExercise.instructions.length > 0 && (
                <div>
                  <h3 className="font-display font-bold mb-3">Instruções</h3>
                  <ol className="space-y-2 list-decimal list-inside">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedExercise.tips.length > 0 && (
                <div>
                  <h3 className="font-display font-bold mb-3">Dicas</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-neon-lime">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedExercise.commonMistakes.length > 0 && (
                <div>
                  <h3 className="font-display font-bold mb-3">Erros Comuns</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    {selectedExercise.commonMistakes.map((mistake, index) => (
                      <li key={index} className="text-sm text-destructive">
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
