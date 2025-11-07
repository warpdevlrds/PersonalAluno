export type UserRole = 'personal' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  status: 'active' | 'warning' | 'inactive';
  personalId: string;
  lastWorkout?: Date;
  createdAt: Date;
}

export interface PhysicalAssessment {
  id: string;
  studentId: string;
  date: Date;
  weight: number;
  height: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  videoUrl?: string;
  gifUrl?: string;
  instructions: string[];
  tips: string[];
  commonMistakes: string[];
  variations?: string[];
  personalId?: string;
  isCustom: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: string;
  rest: number;
  notes?: string;
  order: number;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  studentId: string;
  personalId: string;
  dayOfWeek?: string;
  motivationalMessage?: string;
  exercises: WorkoutExercise[];
  totalVolume?: number;
  estimatedTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  studentId: string;
  date: Date;
  exercises: {
    exerciseId: string;
    sets: {
      reps: number;
      weight?: number;
      completed: boolean;
    }[];
  }[];
  duration: number;
  notes?: string;
  rating?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  read: boolean;
  createdAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'collective';
  goal: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  studentIds: string[];
  personalId: string;
  reward?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  studentId: string;
  unlockedAt: Date;
}

export interface Stats {
  totalWorkouts: number;
  weeklyFrequency: number;
  totalVolume: number;
  totalTime: number;
  currentStreak: number;
  calories?: number;
}
