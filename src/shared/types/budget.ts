export type BudgetPeriod = "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Budget {
  id: string;
  userId: string;
  accountId?: string;
  category: string;
  limit: number;
  spent: number;
  period: BudgetPeriod;
  alertThreshold: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBudgetInput {
  accountId?: string;
  category: string;
  limit: number;
  period?: BudgetPeriod;
  alertThreshold?: number;
  startDate: string;
  endDate: string;
}

export interface UpdateBudgetInput extends Partial<CreateBudgetInput> {
  id: string;
  spent?: number;
}
