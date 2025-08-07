import { create } from "zustand";

type Goal = {
  id: string;
  name: string;
  description: string;
  type: "Retirement" | "Asset" | "Expense";
  value: number;
  startYear: number;
  recurrence: number;
  numOccurrences: number;
  funded: boolean;
};

interface GoalState {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
}

export const useStore = create<GoalState>()((set) => ({
  goals: [],
  setGoals: (goals: Goal[]) => set({ goals }),
  addGoal: (goal: Goal) => set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (goal: Goal) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === goal.id ? goal : g)),
    })),
  deleteGoal: (id: string) =>
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
}));
