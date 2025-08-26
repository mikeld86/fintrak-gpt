import { Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportButtons } from "@/components/export-buttons";

import blueLogo from "@/assets/Blue.svg";

import { formatCurrency } from "@/lib/utils";
import type { FinancialRow } from "@shared/schema";

interface HomeHeaderProps {
  cashOnHand: number;
  bankAccountRows: FinancialRow[];
  week1IncomeRows: FinancialRow[];
  week1ExpenseRows: FinancialRow[];
  week2IncomeRows: FinancialRow[];
  week2ExpenseRows: FinancialRow[];
  week1Balance: number;
  onClearAll: () => void;
}



