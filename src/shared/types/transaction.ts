export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type TransactionStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
  accountId: string;
  status: TransactionStatus;
  notes?: string;
  installmentNumber?: number;
  installmentTotal?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
  accountId: string;
  notes?: string;
  installments?: number;
}

export interface UpdateTransactionInput
  extends Partial<CreateTransactionInput> {
  id: string;
  status?: TransactionStatus;
}

export interface TransactionFilters {
  type?: TransactionType;
  accountId?: string;
  category?: string;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}
