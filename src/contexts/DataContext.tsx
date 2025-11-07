import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Student,
  Exercise,
  Workout,
  WorkoutLog,
  Message,
  PhysicalAssessment,
  Challenge,
  Achievement,
} from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { mockExercises, mockStudents, mockAchievements } from '@/lib/mock-data';

interface DataContextType {
  students: Student[];
  exercises: Exercise[];
  workouts: Workout[];
  workoutLogs: WorkoutLog[];
  messages: Message[];
  assessments: PhysicalAssessment[];
  challenges: Challenge[];
  achievements: Achievement[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkout: (id: string, data: Partial<Workout>) => void;
  addWorkoutLog: (log: Omit<WorkoutLog, 'id'>) => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  markMessageAsRead: (id: string) => void;
  addAssessment: (assessment: Omit<PhysicalAssessment, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [assessments, setAssessments] = useState<PhysicalAssessment[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Initialize data from storage or use mock data
  useEffect(() => {
    const storedStudents = storage.get<Student[]>(STORAGE_KEYS.STUDENTS);
    const storedExercises = storage.get<Exercise[]>(STORAGE_KEYS.EXERCISES);
    const storedWorkouts = storage.get<Workout[]>(STORAGE_KEYS.WORKOUTS);
    const storedWorkoutLogs = storage.get<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS);
    const storedMessages = storage.get<Message[]>(STORAGE_KEYS.MESSAGES);
    const storedAssessments = storage.get<PhysicalAssessment[]>(STORAGE_KEYS.ASSESSMENTS);
    const storedChallenges = storage.get<Challenge[]>(STORAGE_KEYS.CHALLENGES);
    const storedAchievements = storage.get<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);

    setStudents(storedStudents || mockStudents);
    setExercises(storedExercises || mockExercises);
    setWorkouts(storedWorkouts || []);
    setWorkoutLogs(storedWorkoutLogs || []);
    setMessages(storedMessages || []);
    setAssessments(storedAssessments || []);
    setChallenges(storedChallenges || []);
    setAchievements(storedAchievements || mockAchievements);
  }, []);

  // Persist to storage whenever data changes
  useEffect(() => {
    storage.set(STORAGE_KEYS.STUDENTS, students);
  }, [students]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.EXERCISES, exercises);
  }, [exercises]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.WORKOUTS, workouts);
  }, [workouts]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.WORKOUT_LOGS, workoutLogs);
  }, [workoutLogs]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.ASSESSMENTS, assessments);
  }, [assessments]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.CHALLENGES, challenges);
  }, [challenges]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  }, [achievements]);

  const addStudent = (student: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev =>
      prev.map(student => (student.id === id ? { ...student, ...data } : student))
    );
  };

  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(),
    };
    setExercises(prev => [...prev, newExercise]);
  };

  const addWorkout = (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const updateWorkout = (id: string, data: Partial<Workout>) => {
    setWorkouts(prev =>
      prev.map(workout =>
        workout.id === id ? { ...workout, ...data, updatedAt: new Date() } : workout
      )
    );
  };

  const addWorkoutLog = (log: Omit<WorkoutLog, 'id'>) => {
    const newLog: WorkoutLog = {
      ...log,
      id: Date.now().toString(),
    };
    setWorkoutLogs(prev => [...prev, newLog]);
  };

  const addMessage = (message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev =>
      prev.map(message => (message.id === id ? { ...message, read: true } : message))
    );
  };

  const addAssessment = (assessment: Omit<PhysicalAssessment, 'id'>) => {
    const newAssessment: PhysicalAssessment = {
      ...assessment,
      id: Date.now().toString(),
    };
    setAssessments(prev => [...prev, newAssessment]);
  };

  return (
    <DataContext.Provider
      value={{
        students,
        exercises,
        workouts,
        workoutLogs,
        messages,
        assessments,
        challenges,
        achievements,
        addStudent,
        updateStudent,
        addExercise,
        addWorkout,
        updateWorkout,
        addWorkoutLog,
        addMessage,
        markMessageAsRead,
        addAssessment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
