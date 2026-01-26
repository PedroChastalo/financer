"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CreateTransactionInput, TransactionType } from "@/shared/types";

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateTransactionInput) => Promise<void>;
  accounts?: { id: string; name: string }[];
  isLoading?: boolean;
}

const incomeCategories = ["Salário", "Freelance", "Investimentos", "Outros"];
const expenseCategories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Lazer",
  "Educação",
  "Assinaturas",
];

export function AddTransactionModal({
  open,
  onOpenChange,
  onSave,
  accounts = [],
  isLoading = false,
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [formData, setFormData] = useState<
    Omit<CreateTransactionInput, "type">
  >({
    description: "",
    amount: 0,
    category: "",
    accountId: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    installments: 1,
  });

  const categories = type === "INCOME" ? incomeCategories : expenseCategories;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave({ ...formData, type });
    setFormData({
      description: "",
      amount: 0,
      category: "",
      accountId: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      installments: 1,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0520] border-purple-500/30 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Nova Transação
          </DialogTitle>
          <p className="text-purple-300/70 text-sm">
            Registre uma nova receita ou despesa
          </p>
        </DialogHeader>

        <Tabs
          value={type}
          onValueChange={(v) => setType(v as TransactionType)}
          className="w-full mt-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-purple-900/40 h-14">
            <TabsTrigger
              value="EXPENSE"
              className="data-[state=active]:bg-red-500/20 h-full text-base"
            >
              <TrendingDown className="w-5 h-5 mr-2" />
              Despesa
            </TabsTrigger>
            <TabsTrigger
              value="INCOME"
              className="data-[state=active]:bg-cyan-500/20 h-full text-base"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Receita
            </TabsTrigger>
          </TabsList>

          <TabsContent value={type} className="space-y-6 mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-base text-purple-200">Valor</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className="bg-purple-900/40 border-purple-500/30 text-white placeholder:text-purple-400/50 mt-2 text-3xl h-16 text-center font-bold"
                  required
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label className="text-base text-purple-200">Descrição</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Ex: Supermercado Carrefour, Salário Mensal"
                  className="bg-purple-900/40 border-purple-500/30 text-white placeholder:text-purple-400/50 mt-2 h-12"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base text-purple-200">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-purple-900/40 border-purple-500/30 text-white mt-2 h-12">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-950 border-purple-500/30">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="text-white"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base text-purple-200">Conta</Label>
                  <Select
                    value={formData.accountId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, accountId: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-purple-900/40 border-purple-500/30 text-white mt-2 h-12">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-950 border-purple-500/30">
                      {accounts.map((acc) => (
                        <SelectItem
                          key={acc.id}
                          value={acc.id}
                          className="text-white"
                        >
                          {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base text-purple-200">Data</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="bg-purple-900/40 border-purple-500/30 text-white mt-2 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>

                {type === "EXPENSE" && (
                  <div>
                    <Label className="text-base text-purple-200">
                      Parcelas
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.installments || 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          installments: parseInt(e.target.value) || 1,
                        })
                      }
                      className="bg-purple-900/40 border-purple-500/30 text-white mt-2 h-12"
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label className="text-base text-purple-200">
                  Observações (opcional)
                </Label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Adicione detalhes sobre esta transação..."
                  className="bg-purple-900/40 border-purple-500/30 text-white placeholder:text-purple-400/50 mt-2 h-24"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 border-purple-500/30 text-purple-200 hover:bg-purple-500/20 h-12"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className={`flex-1 h-12 ${
                    type === "INCOME"
                      ? "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600"
                      : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Adicionando..." : "Adicionar Transação"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
