"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountCard, AddAccountModal } from "@/modules/accounts/components";
import { BottomNav } from "@/modules/dashboard/components";
import type { Account, CreateAccountInput } from "@/shared/types";

export default function AccountsPage() {
  const [hideBalances, setHideBalances] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await fetch("/api/accounts");
      if (!response.ok) throw new Error("Erro ao carregar contas");
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
    }
  };

  const handleCreateAccount = async (data: CreateAccountInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao criar conta");

      await loadAccounts();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAccount = async (account: Account) => {
    console.log("Editar conta:", account);
  };

  const handleArchiveAccount = async (account: Account) => {
    try {
      const response = await fetch(`/api/accounts/${account.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: true }),
      });

      if (!response.ok) throw new Error("Erro ao arquivar conta");

      await loadAccounts();
    } catch (error) {
      console.error("Erro ao arquivar conta:", error);
    }
  };

  const handleAdjustBalance = async (account: Account) => {
    console.log("Ajustar saldo:", account);
  };

  const totalBalance = accounts
    .filter((acc) => acc.type !== "CREDIT")
    .reduce((sum, acc) => sum + acc.balance, 0);

  const creditUsed = Math.abs(
    accounts
      .filter((acc) => acc.type === "CREDIT")
      .reduce((sum, acc) => sum + acc.balance, 0),
  );

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#0f0520] relative overflow-hidden pb-24">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, purple 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Minhas Contas
              </h1>
              <p className="text-purple-300/70">
                Gerencie suas contas e carteiras
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={() => setHideBalances(!hideBalances)}
                className="bg-purple-500/20 border-purple-500/30 text-purple-200 hover:bg-purple-500/30"
              >
                {hideBalances ? (
                  <Eye className="w-4 h-4 mr-2" />
                ) : (
                  <EyeOff className="w-4 h-4 mr-2" />
                )}
                {hideBalances ? "Mostrar" : "Ocultar"}
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Conta
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/30 backdrop-blur-xl border-purple-400/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-300/70">
                    Saldo Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">
                    {hideBalances
                      ? "••••••"
                      : `R$ ${formatCurrency(totalBalance)}`}
                  </p>
                  <p className="text-sm text-purple-300/60 mt-1">
                    {accounts.filter((acc) => acc.type !== "CREDIT").length}{" "}
                    contas ativas
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-red-600/20 to-red-900/30 backdrop-blur-xl border-red-400/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-300/70">
                    Cartão de Crédito
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-400">
                    {hideBalances
                      ? "••••••"
                      : `-R$ ${formatCurrency(creditUsed)}`}
                  </p>
                  <p className="text-sm text-red-300/60 mt-1">Fatura atual</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {accounts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Plus className="w-8 h-8 text-purple-400/50" />
              </div>
              <p className="text-purple-300/60 mb-4">
                Nenhuma conta cadastrada
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeira conta
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account, index) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  hideBalance={hideBalances}
                  index={index}
                  onEdit={handleEditAccount}
                  onArchive={handleArchiveAccount}
                  onAdjustBalance={handleAdjustBalance}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddAccountModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleCreateAccount}
        isLoading={isLoading}
      />

      <BottomNav activeTab="accounts" />
    </div>
  );
}
