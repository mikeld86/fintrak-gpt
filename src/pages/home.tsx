// src/pages/home.tsx
import React, { useState } from "react";
import { Calculator, Coins, Package, Trash2, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { CashCalculator } from "../components/cash-calculator";
import { WeekCalculator } from "../components/week-calculator";
import { ClearDataDialog } from "../components/clear-data-dialog";
import { useFinancialData } from "../hooks/use-financial-data";
import logo from "../assets/Blue.svg";

// Simple currency formatter
const formatCurrency = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD" }).format(isFinite(n) ? n : 0);

// Minimal structural type to avoid external type deps
type Row = { id?: string; name: string; amount: number; date?: string };

export default function Home() {
  const [showClearDialog, setShowClearDialog] = useState(false);

  const {
    cashOnHand,
    week1Balance,
    additionalWeekBalances,
    financialData,
    dataLoading,
    bankAccountRows,
    week1IncomeRows,
    week1ExpenseRows,
    week2IncomeRows,
    week2ExpenseRows,
    additionalWeeks,
    handleCashUpdate,
    handleWeek1Update,
    handleWeek2Update,
    handleAdditionalWeekUpdate,
    addAdditionalWeek,
    removeAdditionalWeek,
    clearDataMutation,
  } = (useFinancialData() as unknown) as {
    cashOnHand: number;
    week1Balance: number;
    additionalWeekBalances: Record<string, number>;
    financialData: Record<string, number>;
    dataLoading: boolean;
    bankAccountRows: Row[];
    week1IncomeRows: Row[];
    week1ExpenseRows: Row[];
    week2IncomeRows: Row[];
    week2ExpenseRows: Row[];
    additionalWeeks: { id: string; weekNumber: number; name?: string; incomeRows?: Row[]; expenseRows?: Row[] }[];
    handleCashUpdate: (x: { notesTotal: number; coinsTotal: number; total: number }) => void;
    handleWeek1Update: (x: { incomeRows: Row[]; expenseRows: Row[]; bankAccountRows: Row[]; balance: number }) => void;
    handleWeek2Update: (x: { incomeRows: Row[]; expenseRows: Row[]; balance: number }) => void;
    handleAdditionalWeekUpdate: (id: string, x: { incomeRows: Row[]; expenseRows: Row[]; balance: number }) => void;
    addAdditionalWeek: () => void;
    removeAdditionalWeek: (id: string) => void;
    clearDataMutation: { isPending?: boolean; mutate?: () => void };
  };

  // Loading skeleton
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse h-6 w-48 bg-muted rounded mb-3" />
          <p className="text-muted-foreground">Loading your data…</p>
        </div>
      </div>
    );
  }

  const totalBankBalance = (bankAccountRows || []).reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const week2Start = Number(week1Balance || 0);

  // Denominations from saved financialData
  const fd: any = financialData || {};
  const denominations = {
    notes100: Number(fd.notes100 || 0),
    notes50: Number(fd.notes50 || 0),
    notes20: Number(fd.notes20 || 0),
    notes10: Number(fd.notes10 || 0),
    notes5: Number(fd.notes5 || 0),
    coins2: Number(fd.coins2 || 0),
    coins1: Number(fd.coins1 || 0),
    coins050: Number(fd.coins050 || 0),
    coins020: Number(fd.coins020 || 0),
    coins010: Number(fd.coins010 || 0),
    coins005: Number(fd.coins005 || 0),
  };

  const handleClearAll = () => {
    clearDataMutation?.mutate?.();
    setShowClearDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <img src={logo} alt="FINTRAK" className="h-6 w-auto" />
              <span className="sr-only">FINTRAK</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="/inventory">
                <Button variant="ghost" size="sm" className="px-2">
                  <Package className="mr-2 h-4 w-4" />
                  Inventory
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={() => setShowClearDialog(true)} className="px-2">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
          <div className="border-t border-border py-3">
            <div className="grid grid-cols-2 sm:flex sm:justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
              <div>Cash: {formatCurrency(cashOnHand || 0)}</div>
              <div>Bank: {formatCurrency(totalBankBalance)}</div>
              <div>Week 1: {formatCurrency(week1Balance || 0)}</div>
              <div>Week 2: {formatCurrency(week2Start)}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-8 space-y-6">
        {/* Cash Calculator */}
        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Cash on Hand</h2>
          </div>
          <div className="p-4">
            <CashCalculator
              denominations={denominations}
              onUpdate={({ notesTotal, coinsTotal, total }) => {
                handleCashUpdate?.({ notesTotal, coinsTotal, total });
              }}
            />
          </div>
        </section>

        {/* Week 1 */}
        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Calculator className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Week 1</h2>
          </div>
          <div className="p-4">
            <WeekCalculator
              weekNumber={1}
              weekName="Week 1"
              cashOnHand={cashOnHand || 0}
              bankBalance={totalBankBalance}
              startingBalance={0}
              bankAccountRows={(bankAccountRows || []) as Row[]}
              incomeRows={(week1IncomeRows || []) as Row[]}
              expenseRows={(week1ExpenseRows || []) as Row[]}
              onUpdate={({ incomeRows, expenseRows, bankAccountRows, balance }) => {
                handleWeek1Update?.({ incomeRows, expenseRows, bankAccountRows, balance });
              }}
            />
          </div>
        </section>

        {/* Week 2 */}
        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Calculator className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Week 2</h2>
          </div>
          <div className="p-4">
            <WeekCalculator
              weekNumber={2}
              weekName="Week 2"
              startingBalance={week2Start}
              incomeRows={(week2IncomeRows || []) as Row[]}
              expenseRows={(week2ExpenseRows || []) as Row[]}
              onUpdate={({ incomeRows, expenseRows, balance }) => {
                handleWeek2Update?.({ incomeRows, expenseRows, balance });
              }}
            />
          </div>
        </section>

        {/* Additional Weeks */}
        {(additionalWeeks || []).map((week, index) => {
          const prevId = index === 0 ? undefined : (additionalWeeks[index - 1]?.id as string | undefined);
          const prevBalance =
            index === 0
              ? week2Start
              : prevId
              ? Number((additionalWeekBalances || ({} as Record<string, number>))[prevId] || 0)
              : week2Start;

          return (
            <section key={week.id} className="rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-medium">{week.name || `Week ${week.weekNumber}`}</h2>
              </div>
              <div className="p-4">
                <WeekCalculator
                  weekNumber={week.weekNumber}
                  weekName={week.name}
                  startingBalance={prevBalance}
                  incomeRows={(week.incomeRows || []) as Row[]}
                  expenseRows={(week.expenseRows || []) as Row[]}
                  canRemove
                  onUpdate={({ incomeRows, expenseRows, balance }) => {
                    handleAdditionalWeekUpdate?.(week.id, { incomeRows, expenseRows, balance });
                  }}
                  onRemove={() => removeAdditionalWeek?.(week.id)}
                />
              </div>
            </section>
          );
        })}

        <div className="flex gap-2">
          <Button onClick={() => addAdditionalWeek?.()} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add another week
          </Button>
        </div>
      </main>

      <ClearDataDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        onConfirm={handleClearAll}
        pending={!!clearDataMutation?.isPending}
      />
    </div>
  );
}
