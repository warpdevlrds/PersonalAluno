// Local storage utilities for data persistence
const STORAGE_KEYS = {
  USER: 'personal_aluno_user',
  STUDENTS: 'personal_aluno_students',
  EXERCISES: 'personal_aluno_exercises',
  WORKOUTS: 'personal_aluno_workouts',
  WORKOUT_LOGS: 'personal_aluno_workout_logs',
  MESSAGES: 'personal_aluno_messages',
  ASSESSMENTS: 'personal_aluno_assessments',
  CHALLENGES: 'personal_aluno_challenges',
  ACHIEVEMENTS: 'personal_aluno_achievements',
} as const;

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export { STORAGE_KEYS };
