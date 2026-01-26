import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    const accounts = await prisma.financeAccount.findMany({
      where: {
        userId,
        isArchived: false,
      },
    });

    const totalBalance = accounts.reduce(
      (sum, account) => sum + account.balance,
      0,
    );

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 10,
    });

    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const startOfLastWeek = new Date(now);
    startOfLastWeek.setDate(now.getDate() - 7);

    const lastWeekTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startOfLastWeek,
          lte: now,
        },
      },
    });

    const revenueLastWeek = lastWeekTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseLastWeek = lastWeekTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    const goals = await prisma.goal.findMany({
      where: {
        userId,
        status: "IN_PROGRESS",
      },
    });

    const totalGoalTarget = goals.reduce(
      (sum, goal) => sum + goal.targetAmount,
      0,
    );
    const totalGoalCurrent = goals.reduce(
      (sum, goal) => sum + goal.currentAmount,
      0,
    );

    const savingsProgress =
      totalGoalTarget > 0
        ? Math.round((totalGoalCurrent / totalGoalTarget) * 100)
        : 0;

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
    });

    const totalBudgetLimit = budgets.reduce(
      (sum, budget) => sum + budget.limit,
      0,
    );
    const totalBudgetSpent = budgets.reduce(
      (sum, budget) => sum + budget.spent,
      0,
    );

    return NextResponse.json({
      summary: {
        totalBalance,
        totalExpense,
        totalIncome,
        goal: totalGoalTarget,
        savingsProgress,
        revenueLastWeek,
        expenseLastWeek,
        totalBudgetLimit,
        totalBudgetSpent,
      },
      transactions,
      accounts,
      goals,
      budgets,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard" },
      { status: 500 },
    );
  }
}
