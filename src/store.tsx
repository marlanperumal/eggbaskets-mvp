import { create } from "zustand";
import { persist } from "zustand/middleware";

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

type GoalStoreState = {
  goals: Goal[];
};

type GoalStoreActions = {
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
};

type GoalStore = GoalStoreState & GoalStoreActions;

export const useStore = create<GoalStore>()(
  persist(
    (set) => ({
      goals: [],
      setGoals: (goals: Goal[]) => set({ goals }),
      addGoal: (goal: Goal) =>
        set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (goal: Goal) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === goal.id ? goal : g)),
        })),
      deleteGoal: (id: string) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
    }),
    {
      name: "goals-store",
    }
  )
);
