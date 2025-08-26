import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { FinancialData, FinancialRow, AdditionalWeek } from "@shared/schema";

export function useFinancialData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [cashOnHand, setCashOnHand] = useState(0);
  const [week1Balance, setWeek1Balance] = useState(0);
  const [additionalWeekBalances, setAdditionalWeekBalances] = useState<{ [key: string]: number }>({});
  const [financialData, setFinancialData] = useState<Partial<FinancialData>>({});

  const { data: serverFinancialData, isLoading: dataLoading } = useQuery({
    queryKey: ["/api/financial-data"],
    retry: false,
    queryFn: async () => {
      try {
        const response = await fetch("/api/financial-data", {
          credentials: "include",
        });
        if (response.status === 401) {
          return null;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch financial data");
        }
        return await response.json();
      } catch (error) {
        return null;
      }
    },
  });

  useEffect(() => {
    if (serverFinancialData) {
      const data = serverFinancialData as any;
      setFinancialData(data);

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

      const notesTotal = denominations.notes100 * 100 + denominations.notes50 * 50 +
                        denominations.notes20 * 20 + denominations.notes10 * 10 + denominations.notes5 * 5;
      const coinsTotal = denominations.coins2 * 2 + denominations.coins1 * 1 +
                        denominations.coins050 * 0.5 + denominations.coins020 * 0.2 +
                        denominations.coins010 * 0.1 + denominations.coins005 * 0.05;

      setCashOnHand(notesTotal + coinsTotal);
      localStorage.setItem("fintrak-financial-data", JSON.stringify(data));
      localStorage.setItem("fintrak-cash-on-hand", (notesTotal + coinsTotal).toString());
    } else {
      const backupData = localStorage.getItem("fintrak-financial-data");
      const backupCash = localStorage.getItem("fintrak-cash-on-hand");

      if (backupData) {
        try {
          const parsedData = JSON.parse(backupData);
          setFinancialData(parsedData);

          if (backupCash) {
            setCashOnHand(parseFloat(backupCash));
          } else {
            const denominations = {
              notes100: parseFloat(parsedData.notes100 || "0"),
              notes50: parseFloat(parsedData.notes50 || "0"),
              notes20: parseFloat(parsedData.notes20 || "0"),
              notes10: parseFloat(parsedData.notes10 || "0"),
              notes5: parseFloat(parsedData.notes5 || "0"),
              coins2: parseFloat(parsedData.coins2 || "0"),
              coins1: parseFloat(parsedData.coins1 || "0"),
              coins050: parseFloat(parsedData.coins050 || "0"),
              coins020: parseFloat(parsedData.coins020 || "0"),
              coins010: parseFloat(parsedData.coins010 || "0"),
              coins005: parseFloat(parsedData.coins005 || "0"),
            };

            const notesTotal = denominations.notes100 * 100 + denominations.notes50 * 50 +
                              denominations.notes20 * 20 + denominations.notes10 * 10 + denominations.notes5 * 5;
            const coinsTotal = denominations.coins2 * 2 + denominations.coins1 * 1 +
                              denominations.coins050 * 0.5 + denominations.coins020 * 0.2 +
                              denominations.coins010 * 0.1 + denominations.coins005 * 0.05;

            setCashOnHand(notesTotal + coinsTotal);
          }
        } catch (error) {
          console.error("Error parsing backup data:", error);
        }
      }
    }
  }, [serverFinancialData]);

  const saveDataMutation = useMutation({
    mutationFn: async (data: Partial<FinancialData>) => {
      try {
        await apiRequest("PUT", "/api/financial-data", data);
      } catch (error) {
        // ignore
      }
    },
  });

  const clearDataMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiRequest("DELETE", "/api/financial-data");
      } catch (error) {
        // ignore
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial-data"] });
      setFinancialData({});
      setCashOnHand(0);
      setWeek1Balance(0);
      setAdditionalWeekBalances({});
      toast({
        title: "Success",
        description: "All financial data has been cleared.",
      });
    },
  });

  useEffect(() => {
    if (financialData && Object.keys(financialData).length > 0) {
      localStorage.setItem("fintrak-financial-data", JSON.stringify(financialData));
      localStorage.setItem("fintrak-last-update", Date.now().toString());

      const timeoutId = setTimeout(() => {
        saveDataMutation.mutate(financialData);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [financialData]);

  useEffect(() => {
    const week1Backup = localStorage.getItem("fintrak-week1-balance");
    const additionalBackup = localStorage.getItem("fintrak-additional-balances");

    if (week1Backup) {
      setWeek1Balance(parseFloat(week1Backup));
    }
    if (additionalBackup) {
      try {
        setAdditionalWeekBalances(JSON.parse(additionalBackup));
      } catch (error) {
        console.error("Error loading balance backup:", error);
      }
    }
  }, []);

  const updateFinancialData = (updates: Partial<FinancialData>) => {
    setFinancialData(prev => ({ ...prev, ...updates }));
  };

  const handleCashUpdate = (denominations: any, totalCash: number) => {
    setCashOnHand(totalCash);
    localStorage.setItem("fintrak-cash-on-hand", totalCash.toString());

    updateFinancialData({
      notes100: denominations.notes100.toString(),
      notes50: denominations.notes50.toString(),
      notes20: denominations.notes20.toString(),
      notes10: denominations.notes10.toString(),
      notes5: denominations.notes5.toString(),
      coins2: denominations.coins2.toString(),
      coins1: denominations.coins1.toString(),
      coins050: denominations.coins050.toString(),
      coins020: denominations.coins020.toString(),
      coins010: denominations.coins010.toString(),
      coins005: denominations.coins005.toString(),
    });
  };

  const handleWeek1Update = ({ incomeRows, expenseRows, bankAccountRows, balance }: {
    incomeRows: FinancialRow[];
    expenseRows: FinancialRow[];
    bankAccountRows?: FinancialRow[];
    balance: number;
  }) => {
    setWeek1Balance(balance);
    localStorage.setItem("fintrak-week1-balance", balance.toString());

    const updateData: any = {
      week1IncomeRows: incomeRows,
      week1ExpenseRows: expenseRows,
    };
    if (bankAccountRows) {
      updateData.bankAccountRows = bankAccountRows;
    }

    updateFinancialData(updateData);
  };

  const handleWeek2Update = ({ incomeRows, expenseRows }: {
    incomeRows: FinancialRow[];
    expenseRows: FinancialRow[];
  }) => {
    updateFinancialData({
      week2IncomeRows: incomeRows,
      week2ExpenseRows: expenseRows,
    });
  };

  const handleAdditionalWeekUpdate = (weekId: string, { incomeRows, expenseRows, balance }: {
    incomeRows: FinancialRow[];
    expenseRows: FinancialRow[];
    balance: number;
  }) => {
    setAdditionalWeekBalances(prev => {
      const updated = { ...prev, [weekId]: balance };
      localStorage.setItem("fintrak-additional-balances", JSON.stringify(updated));
      return updated;
    });

    const additionalWeeks = (financialData.additionalWeeks as any[]) || [];
    const updatedWeeks = additionalWeeks.map(week =>
      week.id === weekId ? { ...week, incomeRows, expenseRows } : week
    );

    updateFinancialData({ additionalWeeks: updatedWeeks });
  };

  const addAdditionalWeek = () => {
    const additionalWeeks = (financialData.additionalWeeks as any[]) || [];
    const newWeekNumber = 3 + additionalWeeks.length;
    const newWeek = {
      id: `week-${Date.now()}`,
      weekNumber: newWeekNumber,
      name: `Week ${newWeekNumber}`,
      incomeRows: [],
      expenseRows: [],
    };

    updateFinancialData({ additionalWeeks: [...additionalWeeks, newWeek] });
  };

  const removeAdditionalWeek = (weekId: string) => {
    const additionalWeeks = (financialData.additionalWeeks as any[]) || [];
    const updatedWeeks = additionalWeeks.filter(week => week.id !== weekId);

    const renumberedWeeks = updatedWeeks.map((week, index) => ({
      ...week,
      weekNumber: 3 + index,
      name: `Week ${3 + index}`,
    }));

    updateFinancialData({ additionalWeeks: renumberedWeeks });

    setAdditionalWeekBalances(prev => {
      const newBalances = { ...prev };
      delete newBalances[weekId];
      return newBalances;
    });
  };

  const bankAccountRows = (financialData.bankAccountRows as FinancialRow[]) || [];
  const week1IncomeRows = (financialData.week1IncomeRows as FinancialRow[]) || [];
  const week1ExpenseRows = (financialData.week1ExpenseRows as FinancialRow[]) || [];
  const week2IncomeRows = (financialData.week2IncomeRows as FinancialRow[]) || [];
  const week2ExpenseRows = (financialData.week2ExpenseRows as FinancialRow[]) || [];
  const additionalWeeks = (financialData.additionalWeeks as AdditionalWeek[]) || [];

  return {
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
  };
}

