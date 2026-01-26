export type GoalStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalInput {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
  icon?: string;
  color?: string;
}

export interface UpdateGoalInput extends Partial<CreateGoalInput> {
  id: string;
  status?: GoalStatus;
}
