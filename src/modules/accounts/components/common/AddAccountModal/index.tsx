"use client";

import {
  CreditCard,
  DollarSign,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
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
import type { AccountType, CreateAccountInput } from "@/shared/types";

interface AddAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateAccountInput) => Promise<void>;
  isLoading?: boolean;
}

const accountTypes: {
  value: AccountType;
  label: string;
  icon: typeof Wallet;
}[] = [
  { value: "CHECKING", label: "Conta Corrente", icon: Wallet },
  { value: "SAVINGS", label: "Poupança", icon: PiggyBank },
  { value: "CASH", label: "Dinheiro", icon: DollarSign },
  { value: "CREDIT", label: "Cartão de Crédito", icon: CreditCard },
  { value: "INVESTMENT", label: "Investimento", icon: TrendingUp },
];

const colors = [
  "#8B5CF6",
  "#10B981",
  "#EF4444",
  "#F59E0B",
  "#06B6D4",
  "#EC4899",
  "#3B82F6",
];

export function AddAccountModal({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}: AddAccountModalProps) {
  const [formData, setFormData] = useState<CreateAccountInput>({
    name: "",
    type: "CHECKING",
    balance: 0,
    color: colors[0],
    creditLimit: undefined,
    closingDay: undefined,
    dueDay: undefined,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave(formData);
    setFormData({
      name: "",
      type: "CHECKING",
      balance: 0,
      color: colors[0],
      creditLimit: undefined,
      closingDay: undefined,
      dueDay: undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0520] border-purple-500/30 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Nova Conta
          </DialogTitle>
          <p className="text-purple-300/70 text-sm">
            Adicione uma nova conta para gerenciar suas finanças
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label className="text-base text-purple-200">Nome da Conta</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Nubank, Carteira, PagBank"
                className="bg-purple-900/40 border-purple-500/30 text-white placeholder:text-purple-400/50 mt-2 h-12"
                required
                autoFocus
                disabled={isLoading}
              />
            </div>

            <div>
              <Label className="text-base text-purple-200">Tipo de Conta</Label>
              <Select
                value={formData.type}
                onValueChange={(value: AccountType) =>
                  setFormData({ ...formData, type: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger className="bg-purple-900/40 border-purple-500/30 text-white mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-purple-950 border-purple-500/30">
                  {accountTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="text-white"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base text-purple-200">Saldo Inicial</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.balance || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    balance: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                className="bg-purple-900/40 border-purple-500/30 text-white placeholder:text-purple-400/50 mt-2 h-12 text-lg"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label className="text-base text-purple-200">
              Cor de Identificação
            </Label>
            <div className="flex gap-3 mt-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-12 h-12 rounded-xl border-2 ${
                    formData.color === color
                      ? "border-white scale-110 shadow-lg"
                      : "border-purple-500/30"
                  } transition-all hover:scale-105`}
                  style={{ backgroundColor: color }}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {formData.type === "CREDIT" && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-medium text-purple-200 mb-3">
                Informações do Cartão de Crédito
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-purple-200">
                    Limite do Cartão
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.creditLimit || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creditLimit: parseFloat(e.target.value) || undefined,
                      })
                    }
                    placeholder="5000.00"
                    className="bg-purple-900/40 border-purple-500/30 text-white mt-2 h-11"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label className="text-sm text-purple-200">
                    Dia Fechamento
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.closingDay || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        closingDay: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="15"
                    className="bg-purple-900/40 border-purple-500/30 text-white mt-2 h-11"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label className="text-sm text-purple-200">
                    Dia Vencimento
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.dueDay || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dueDay: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="22"
                    className="bg-purple-900/40 border-purple-500/30 text-white mt-2 h-11"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

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
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 h-12"
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Conta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
