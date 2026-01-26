"use client";

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
import type { CreateBudgetInput } from "@/shared/types";

interface AddBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateBudgetInput) => Promise<void>;
  isLoading?: boolean;
}

const categories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Lazer",
  "Educação",
  "Assinaturas",
];

export function AddBudgetModal({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}: AddBudgetModalProps) {
  const [formData, setFormData] = useState<CreateBudgetInput>({
    category: "",
    amount: 0,
    alertThreshold: 80,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave(formData);
    setFormData({ category: "", amount: 0, alertThreshold: 80 });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0520] border-purple-500/30 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Novo Orçamento
          </DialogTitle>
          <p className="text-purple-300/70 text-sm">
            Defina um limite de gastos para uma categoria
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-purple-950 border-purple-500/30">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-white">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base text-purple-200">Limite Mensal</Label>
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
            <Label className="text-base text-purple-200">
              Alerta ao atingir
            </Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.alertThreshold || 80}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alertThreshold: parseInt(e.target.value) || 80,
                  })
                }
                className="bg-purple-900/40 border-purple-500/30 text-white h-12 text-center text-lg font-semibold"
                disabled={isLoading}
              />
              <span className="text-2xl font-bold text-purple-300">%</span>
            </div>
            <p className="text-sm text-purple-300/60 mt-2">
              Você será alertado ao gastar {formData.alertThreshold}% do limite
            </p>
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
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 h-12"
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Orçamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
