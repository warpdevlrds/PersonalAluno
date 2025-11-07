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
  const { students, exercises, addWorkout } = useData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [studentId, setStudentId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);

  const addExercise = () => {
    setWorkoutExercises(prev => [
      ...prev,
      {
        exerciseId: '',
        sets: 3,
        reps: '12',
        rest: 60,
        order: prev.length,
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setWorkoutExercises(prev =>
      prev
        .filter((_, i) => i !== index)
        .map((exercise, order) => ({ ...exercise, order }))
    );
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    setWorkoutExercises(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('Não foi possível identificar o personal logado.');
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedMotivation = motivationalMessage.trim();

    if (!trimmedName || !studentId || !dayOfWeek || workoutExercises.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const hasInvalidExercise = workoutExercises.some(exercise => {
      const hasExerciseId = Boolean(exercise.exerciseId);
      const hasSets = Number.isFinite(exercise.sets) && exercise.sets > 0;
      const hasReps = Boolean(String(exercise.reps).trim());
      const restIsValid = Number.isFinite(exercise.rest) && exercise.rest >= 0;
      return !(hasExerciseId && hasSets && hasReps && restIsValid);
    });

    if (hasInvalidExercise) {
      toast.error('Verifique as informações de cada exercício antes de salvar.');
      return;
    }

    setIsSaving(true);

    try {
      await Promise.resolve(
        addWorkout({
          name: trimmedName,
          description: trimmedDescription || undefined,
          studentId,
          personalId: user.id,
          dayOfWeek,
          motivationalMessage: trimmedMotivation || undefined,
          exercises: workoutExercises.map((exercise, index) => ({
            ...exercise,
            order: index,
            reps: String(exercise.reps).trim(),
          })),
        })
      );

      toast.success('Treino criado com sucesso!');
      onNavigate('/students');
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível criar o treino. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
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

          <div>
            <Label>Dia da Semana</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Segunda-feira</SelectItem>
                <SelectItem value="tuesday">Terça-feira</SelectItem>
                <SelectItem value="wednesday">Quarta-feira</SelectItem>
                <SelectItem value="thursday">Quinta-feira</SelectItem>
                <SelectItem value="friday">Sexta-feira</SelectItem>
                <SelectItem value="saturday">Sábado</SelectItem>
                <SelectItem value="sunday">Domingo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Mensagem Motivacional</Label>
            <Textarea
              value={motivationalMessage}
              onChange={(e) => setMotivationalMessage(e.target.value)}
              placeholder="Adicione uma mensagem inspiradora para o aluno"
            />
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
                <Input
                  type="number"
                  value={ex.sets}
                  min={1}
                  onChange={(e) => updateExercise(index, 'sets', Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Reps</Label>
                <Input value={ex.reps} onChange={(e) => updateExercise(index, 'reps', e.target.value)} placeholder="12" />
              </div>
              <div>
                <Label>Descanso (s)</Label>
                <Input
                  type="number"
                  value={ex.rest}
                  min={0}
                  onChange={(e) => updateExercise(index, 'rest', Number(e.target.value))}
                />
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
        <Button onClick={handleSave} className="btn-neon gap-2" disabled={isSaving}>
          <Save className="h-4 w-4" /> Salvar Treino
        </Button>
      </div>
    </div>
  );
}
