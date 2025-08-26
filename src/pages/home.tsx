import { useState } from "react";
import { Calculator, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CashCalculator } from "@/components/cash-calculator";
import { WeekCalculator } from "@/components/week-calculator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatCurrency } from "@/lib/utils";
import { useFinancialData } from "@/hooks/use-financial-data";
import { HomeHeader } from "@/components/home-header";
import { ClearDataDialog } from "@/components/clear-data-dialog";

export default function Home() {
  // Temporarily bypass auth for development testing
  const user = { id: "46429020" };
  const authLoading = false;
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
  } = useFinancialData();

  const handleClearData = () => {
    setShowClearDialog(false);
    clearDataMutation.mutate();
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return null; // Let App.tsx handle authentication routing
  }

  // Parse cash denominations
  const data = financialData as any;
  const denominations = {
    notes100: parseFloat(data.notes100 || "0"),
    notes50: parseFloat(data.notes50 || "0"),
    notes20: parseFloat(data.notes20 || "0"),
    notes10: parseFloat(data.notes10 || "0"),
    notes5: parseFloat(data.notes5 || "0"),
    coins2: parseFloat(data.coins2 || "0"),
    coins1: parseFloat(data.coins1 || "0"),
    coins050: parseFloat(data.coins050 || "0"),
    coins020: parseFloat(data.coins020 || "0"),
    coins010: parseFloat(data.coins010 || "0"),
    coins005: parseFloat(data.coins005 || "0"),
  };

  return (
    <div className="min-h-screen bg-background">
      <HomeHeader
        cashOnHand={cashOnHand}
        bankAccountRows={bankAccountRows}
        week1IncomeRows={week1IncomeRows}
        week1ExpenseRows={week1ExpenseRows}
        week2IncomeRows={week2IncomeRows}
        week2ExpenseRows={week2ExpenseRows}
        week1Balance={week1Balance}
        onClearAll={() => setShowClearDialog(true)}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Cash Calculator in Card Container */}
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="cash-calculator" className="border border-border rounded-lg bg-card">
                <AccordionTrigger className="text-base font-medium px-6 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center justify-between w-full mr-4">
                    <div className="flex items-center">
                      <Coins className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                      <span>Cash Calculator</span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(cashOnHand)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <CashCalculator
                    denominations={denominations}
                    onUpdate={handleCashUpdate}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Week 1 Calculator */}
          <WeekCalculator
            weekNumber={1}
            cashOnHand={cashOnHand}
            bankAccountRows={bankAccountRows}
            incomeRows={week1IncomeRows}
            expenseRows={week1ExpenseRows}
            onUpdate={handleWeek1Update}
          />
          
          {/* Week 2 Calculator */}
          <WeekCalculator
            weekNumber={2}
            startingBalance={week1Balance}
            incomeRows={week2IncomeRows}
            expenseRows={week2ExpenseRows}
            onUpdate={handleWeek2Update}
          />
          
          {/* Additional Weeks */}
          {additionalWeeks.map((week, index) => (
            <WeekCalculator
              key={week.id}
              weekNumber={week.weekNumber}
              weekName={week.name}
              startingBalance={
                index === 0 
                  ? week1Balance + week2IncomeRows.reduce((sum, row) => sum + row.amount, 0) - week2ExpenseRows.reduce((sum, row) => sum + row.amount, 0)
                  : additionalWeekBalances[additionalWeeks[index - 1]?.id] || 0
              }
              incomeRows={week.incomeRows}
              expenseRows={week.expenseRows}
              canRemove={true}
              onUpdate={(data) => handleAdditionalWeekUpdate(week.id, data)}
              onRemove={() => removeAdditionalWeek(week.id)}
            />
          ))}
          
          {/* Add Week Button */}
          <div className="lg:col-span-2 flex justify-center">
            <Button
              onClick={addAdditionalWeek}
              variant="outline"
              className="w-full max-w-md"
            >
              + Add Week {3 + additionalWeeks.length}
            </Button>
          </div>
        </div>
      </main>


      <ClearDataDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        onConfirm={handleClearData}
        pending={clearDataMutation.isPending}
      />
    </div>
  );
}
