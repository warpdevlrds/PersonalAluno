import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { WorkoutExercise } from '@/types';

interface CreateWorkoutPageProps {
  onNavigate: (path: string) => void;
}

export function CreateWorkoutPage({ onNavigate }: CreateWorkoutPageProps) {
  const { user } = useAuth();
  const { students, exercises } = useData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [studentId, setStudentId] = useState('');
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);

  const addExercise = () => {
    setWorkoutExercises([...workoutExercises, {
      exerciseId: '',
      sets: 3,
      reps: '12',
      rest: 60,
      order: workoutExercises.length,
    }]);
  };

  const removeExercise = (index: number) => {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    const updated = [...workoutExercises];
    updated[index] = { ...updated[index], [field]: value };
    setWorkoutExercises(updated);
  };

  const handleSave = () => {
    if (!name || !studentId || workoutExercises.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    toast.success('Treino criado com sucesso!');
    onNavigate('/students');
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-black gradient-text">Criar Novo Treino</h1>
        <Button onClick={() => onNavigate('/students')} variant="outline">Cancelar</Button>
      </div>

      <Card className="p-6 glass-card">
        <div className="space-y-4">
          <div>
            <Label>Nome do Treino</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Treino A - Peito e Tríceps" />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição opcional" />
          </div>

          <div>
            <Label>Aluno</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {students.filter(s => s.personalId === user?.id).map(student => (
                  <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold">Exercícios</h2>
          <Button onClick={addExercise} className="btn-neon gap-2">
            <Plus className="h-4 w-4" /> Adicionar Exercício
          </Button>
        </div>

        {workoutExercises.map((ex, index) => (
          <Card key={index} className="p-4 glass-card">
            <div className="grid gap-4 md:grid-cols-6">
              <div className="md:col-span-2">
                <Label>Exercício</Label>
                <Select value={ex.exerciseId} onValueChange={(v) => updateExercise(index, 'exerciseId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises.map(exercise => (
                      <SelectItem key={exercise.id} value={exercise.id}>{exercise.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Séries</Label>
                <Input type="number" value={ex.sets} onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))} />
              </div>
              <div>
                <Label>Reps</Label>
                <Input value={ex.reps} onChange={(e) => updateExercise(index, 'reps', e.target.value)} placeholder="12" />
              </div>
              <div>
                <Label>Descanso (s)</Label>
                <Input type="number" value={ex.rest} onChange={(e) => updateExercise(index, 'rest', parseInt(e.target.value))} />
              </div>
              <div className="flex items-end">
                <Button variant="destructive" size="icon" onClick={() => removeExercise(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button onClick={handleSave} className="btn-neon gap-2">
          <Save className="h-4 w-4" /> Salvar Treino
        </Button>
      </div>
    </div>
  );
}
