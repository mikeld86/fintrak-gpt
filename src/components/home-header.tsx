import { Package, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ExportButtons } from "@/components/export-buttons";
import logo from "@/assets/Blue.svg";
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

export function HomeHeader({
  cashOnHand,
  bankAccountRows,
  week1IncomeRows,
  week1ExpenseRows,
  week2IncomeRows,
  week2ExpenseRows,
  week1Balance,
  onClearAll,
}: HomeHeaderProps) {
  const week2Balance =
    week1Balance +
    week2IncomeRows.reduce((sum, r) => sum + r.amount, 0) -
    week2ExpenseRows.reduce((sum, r) => sum + r.amount, 0);

  const totalBankBalance = bankAccountRows.reduce((sum, r) => sum + r.amount, 0);

  const exportData = {
    cashOnHand,
    bankAccountRows,
    week1IncomeRows,
    week1ExpenseRows,
    week2IncomeRows,
    week2ExpenseRows,
    week1Balance,
    week2Balance,
    totalBankBalance,
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FINTRAK" className="h-6 w-auto" />
            <span className="sr-only">FINTRAK</span>
          </div>
          <div className="flex items-center gap-2">
            <ExportButtons data={exportData} />
            <Link href="/inventory">
              <Button variant="ghost" size="sm" className="px-2">
                <Package className="mr-2 h-4 w-4" />
                Inventory
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={onClearAll} className="px-2">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <div className="border-t border-border py-3">
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
            <div>Cash: {formatCurrency(cashOnHand)}</div>
            <div>Bank: {formatCurrency(totalBankBalance)}</div>
            <div>Week 1: {formatCurrency(week1Balance)}</div>
            <div>Week 2: {formatCurrency(week2Balance)}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
