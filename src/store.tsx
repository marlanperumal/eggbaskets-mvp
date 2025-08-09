import { create } from "zustand";
import { persist } from "zustand/middleware";

// Constants
export const CURRENT_ACCOUNT_ID = "current-account";

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

type Income = {
  id: string;
  name: string;
  description: string;
  value: number;
  startYear: number;
  endYear: number;
  annualGrowthRate: number;
};

type IncomeStoreState = {
  incomes: Income[];
};

type IncomeStoreActions = {
  setIncomes: (incomes: Income[]) => void;
  addIncome: (income: Income) => void;
  updateIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;
};

type IncomeStore = IncomeStoreState & IncomeStoreActions;

type Expense = {
  id: string;
  name: string;
  description: string;
  value: number;
  startYear: number;
  endYear: number;
  annualGrowthRate: number;
};

type ExpenseStoreState = {
  expenses: Expense[];
};

type ExpenseStoreActions = {
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
};

type ExpenseStore = ExpenseStoreState & ExpenseStoreActions;

type Asset = {
  id: string;
  name: string;
  type:
    | "Cash"
    | "Fixed Appreciating"
    | "Fixed Depreciating"
    | "Investment"
    | "Retirement Savings"
    | "Other";
  description: string;
  value: number;
  startYear: number;
  endYear: number;
  monthlyContribution: number;
  annualGrowthRate: number;
};

type AssetStoreState = {
  assets: Asset[];
};

type AssetStoreActions = {
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
};

type AssetStore = AssetStoreState & AssetStoreActions;

type Liability = {
  id: string;
  name: string;
  type: "Mortgage" | "Loan" | "Credit Card" | "Other";
  description: string;
  value: number;
  startYear: number;
  termInMonths: number;
  interestRate: number;
  monthlyPayment: number;
};

type LiabilityStoreState = {
  liabilities: Liability[];
};

type LiabilityStoreActions = {
  setLiabilities: (liabilities: Liability[]) => void;
  addLiability: (liability: Liability) => void;
  updateLiability: (liability: Liability) => void;
  deleteLiability: (id: string) => void;
};

type LiabilityStore = LiabilityStoreState & LiabilityStoreActions;

type Store = GoalStore &
  IncomeStore &
  ExpenseStore &
  AssetStore &
  LiabilityStore & {
    resetStore: () => void;
  };

export const useStore = create<Store>()(
  persist(
    (set): Store => ({
      goals: [],
      incomes: [],
      expenses: [],
      assets: [
        {
          id: CURRENT_ACCOUNT_ID,
          name: "Current Account",
          type: "Cash",
          description: "Your current cash balance",
          value: 0,
          startYear: new Date().getFullYear(),
          endYear: new Date().getFullYear() + 50,
          monthlyContribution: 0,
          annualGrowthRate: 0,
        },
      ],
      liabilities: [],
      setGoals: (goals: Goal[]) => set({ goals }),
      addGoal: (goal: Goal) =>
        set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (goal: Goal) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === goal.id ? goal : g)),
        })),
      deleteGoal: (id: string) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
      setIncomes: (incomes: Income[]) => set({ incomes }),
      addIncome: (income: Income) =>
        set((state) => ({ incomes: [...state.incomes, income] })),
      updateIncome: (income: Income) =>
        set((state) => ({
          incomes: state.incomes.map((i) => (i.id === income.id ? income : i)),
        })),
      deleteIncome: (id: string) =>
        set((state) => ({ incomes: state.incomes.filter((i) => i.id !== id) })),
      setExpenses: (expenses: Expense[]) => set({ expenses }),
      addExpense: (expense: Expense) =>
        set((state) => ({ expenses: [...state.expenses, expense] })),
      updateExpense: (expense: Expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === expense.id ? expense : e
          ),
        })),
      deleteExpense: (id: string) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      setAssets: (assets: Asset[]) => {
        // Ensure Current Account is always present
        const currentAccount = assets.find(
          (asset) => asset.id === CURRENT_ACCOUNT_ID
        );
        const otherAssets = assets.filter(
          (asset) => asset.id !== CURRENT_ACCOUNT_ID
        );

        const defaultCurrentAccount: Asset = {
          id: CURRENT_ACCOUNT_ID,
          name: "Current Account",
          type: "Cash",
          description: "Your current cash balance",
          value: currentAccount?.value ?? 0,
          startYear: new Date().getFullYear(),
          endYear: new Date().getFullYear() + 50,
          monthlyContribution: 0,
          annualGrowthRate: 0,
        };

        set({ assets: [defaultCurrentAccount, ...otherAssets] });
      },
      addAsset: (asset: Asset) =>
        set((state) => ({ assets: [...state.assets, asset] })),
      updateAsset: (asset: Asset) =>
        set((state) => {
          // If this is the Current Account, only allow value changes
          if (asset.id === CURRENT_ACCOUNT_ID) {
            return {
              assets: state.assets.map((a) =>
                a.id === asset.id ? { ...a, value: asset.value } : a
              ),
            };
          }

          // For other assets, allow full updates
          return {
            assets: state.assets.map((a) => (a.id === asset.id ? asset : a)),
          };
        }),
      deleteAsset: (id: string) =>
        set((state) => {
          // Prevent deletion of Current Account
          if (id === CURRENT_ACCOUNT_ID) {
            return state;
          }
          return { assets: state.assets.filter((a) => a.id !== id) };
        }),
      setLiabilities: (liabilities: Liability[]) => set({ liabilities }),
      addLiability: (liability: Liability) =>
        set((state) => ({ liabilities: [...state.liabilities, liability] })),
      updateLiability: (liability: Liability) =>
        set((state) => ({
          liabilities: state.liabilities.map((l) =>
            l.id === liability.id ? liability : l
          ),
        })),
      deleteLiability: (id: string) =>
        set((state) => ({
          liabilities: state.liabilities.filter((l) => l.id !== id),
        })),
      resetStore: () =>
        set({
          goals: [],
          incomes: [],
          expenses: [],
          assets: [
            {
              id: CURRENT_ACCOUNT_ID,
              name: "Current Account",
              type: "Cash",
              description: "Your current cash balance",
              value: 0,
              startYear: new Date().getFullYear(),
              endYear: new Date().getFullYear() + 50,
              monthlyContribution: 0,
              annualGrowthRate: 0,
            },
          ],
          liabilities: [],
        }),
    }),
    {
      name: "eggbaskets-store",
    }
  )
);
