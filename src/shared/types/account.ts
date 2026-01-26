export type AccountType =
  | "CHECKING"
  | "SAVINGS"
  | "CASH"
  | "CREDIT"
  | "INVESTMENT";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
  icon: string;
  isActive: boolean;
  creditLimit?: number;
  closingDay?: number;
  dueDay?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  balance: number;
  color: string;
  creditLimit?: number;
  closingDay?: number;
  dueDay?: number;
}

export interface UpdateAccountInput extends Partial<CreateAccountInput> {
  id: string;
}
