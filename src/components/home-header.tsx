import { Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/theme-selector";
import { ExportButtons } from "@/components/export-buttons";
import { useTheme } from "@/contexts/simple-theme-context";

import blueLogo from "@/assets/Blue.svg";
import pinkLogo from "@/assets/Pink.svg";
import yellowLogo from "@/assets/Yellow.svg";

import blueLogo from "../assets/Blue.svg";
import pinkLogo from "../assets/Pink.svg";
import yellowLogo from "../assets/Yellow.svg";

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
    week2IncomeRows.reduce((sum, row) => sum + row.amount, 0) -
    week2ExpenseRows.reduce((sum, row) => sum + row.amount, 0);
  const totalBankBalance = bankAccountRows.reduce((sum, row) => sum + row.amount, 0);

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

  const { theme } = useTheme();
  const logos = { blue: blueLogo, pink: pinkLogo, yellow: yellowLogo };

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <img src={logos[theme]} alt="FINTRAK Logo" className="h-7 sm:h-9 object-contain" />
          </div>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/inventory")}
            >
              <Package className="h-4 w-4 mr-1" />
              Inventory
            </Button>
            <ThemeSelector />
            <ExportButtons data={exportData} />
            <Button variant="destructive" size="sm" onClick={onClearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/login")}
            >
              Sign Out
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/inventory")}
            >
              <Package className="h-4 w-4" />
            </Button>
            <ExportButtons data={exportData} />
            <Button
              variant="destructive"
              size="sm"
              onClick={onClearAll}
              className="px-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/login")}
              className="px-2"
            >
              Sign Out
            </Button>
            <ThemeSelector />
          </div>
        </div>

        {/* Summary Bar */}
        <div className="border-t border-border py-3">
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center justify-center sm:justify-start">
              <span className="text-muted-foreground mr-1 sm:mr-2">Cash:</span>
              <span className="font-semibold text-foreground">{formatCurrency(cashOnHand)}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <span className="text-muted-foreground mr-1 sm:mr-2">Bank:</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(totalBankBalance)}
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <span className="text-muted-foreground mr-1 sm:mr-2">Week 1:</span>
              <span className="font-semibold text-primary">{formatCurrency(week1Balance)}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <span className="text-muted-foreground mr-1 sm:mr-2">Week 2:</span>
              <span className="font-semibold text-primary">
                {formatCurrency(week2Balance)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

