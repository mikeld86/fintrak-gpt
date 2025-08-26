import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SalesRecord, InsertSalesRecord, InventoryBatch } from "@shared/schema";

export function useSalesRecords(selectedBatch?: InventoryBatch) {
  const queryClient = useQueryClient();

  const { data: salesRecords = [], isLoading } = useQuery<SalesRecord[]>({
    queryKey: ["/api/sales-records", selectedBatch?.id],
    retry: false,
    enabled: !!selectedBatch,
    queryFn: async () => {
      if (!selectedBatch) return [];

      try {
        const response = await fetch(`/api/sales-records?batchId=${selectedBatch.id}`, {
          credentials: "include",
        });
        if (response.status === 401) {
          const localData = localStorage.getItem(`fintrak-sales-records-${selectedBatch.id}`);
          return localData ? JSON.parse(localData) : [];
        }
        if (!response.ok) return [];
        const data = await response.json();
        localStorage.setItem(`fintrak-sales-records-${selectedBatch.id}`, JSON.stringify(data));
        return data;
      } catch (error) {
        const localData = localStorage.getItem(`fintrak-sales-records-${selectedBatch.id}`);
        return localData ? JSON.parse(localData) : [];
      }
    },
  });

  const addSaleMutation = useMutation({
    mutationFn: async (saleData: InsertSalesRecord) => {
      try {
        const response = await apiRequest("POST", "/api/sales-records", saleData);
        return await response.json();
      } catch (error) {
        const localKey = `fintrak-sales-records-${saleData.batchId}`;
        const localData = JSON.parse(localStorage.getItem(localKey) || "[]");
        const newSale = {
          ...saleData,
          id: `sale_${Date.now()}`,
          userId: "46429020",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as SalesRecord;

        localData.push(newSale);
        localStorage.setItem(localKey, JSON.stringify(localData));

        const batchData = JSON.parse(localStorage.getItem("fintrak-inventory-batches") || "[]");
        const batchIndex = batchData.findIndex((b: any) => b.id === saleData.batchId);
        if (batchIndex >= 0) {
          batchData[batchIndex].qtySold = (batchData[batchIndex].qtySold || 0) + saleData.qty;
          batchData[batchIndex].qtyInStock = Math.max(0, batchData[batchIndex].qtyInStock - saleData.qty);

          const allSales = [...localData, newSale];
          const totalRevenue = allSales.reduce((sum: number, sale: any) => sum + parseFloat(sale.totalPrice), 0);
          const totalQtySold = allSales.reduce((sum: number, sale: any) => sum + sale.qty, 0);
          batchData[batchIndex].actualSaleCostPerUnit = totalQtySold > 0 ? (totalRevenue / totalQtySold).toString() : "0";

          localStorage.setItem("fintrak-inventory-batches", JSON.stringify(batchData));
        }

        return newSale;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-batches"] });
    },
  });

  const deleteSaleMutation = useMutation({
    mutationFn: async (saleId: string) => {
      try {
        await apiRequest("DELETE", `/api/sales-records/${saleId}`);
      } catch (error) {
        if (!selectedBatch) return;
        const localKey = `fintrak-sales-records-${selectedBatch.id}`;
        const localData = JSON.parse(localStorage.getItem(localKey) || "[]");
        const saleToDelete = localData.find((s: any) => s.id === saleId);
        const filtered = localData.filter((s: any) => s.id !== saleId);
        localStorage.setItem(localKey, JSON.stringify(filtered));

        if (saleToDelete) {
          const batchData = JSON.parse(localStorage.getItem("fintrak-inventory-batches") || "[]");
          const batchIndex = batchData.findIndex((b: any) => b.id === selectedBatch.id);
          if (batchIndex >= 0) {
            batchData[batchIndex].qtySold = Math.max(0, (batchData[batchIndex].qtySold || 0) - saleToDelete.qty);
            batchData[batchIndex].qtyInStock = batchData[batchIndex].qtyInStock + saleToDelete.qty;
            localStorage.setItem("fintrak-inventory-batches", JSON.stringify(batchData));
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-batches"] });
    },
  });

  return { salesRecords, isLoading, addSaleMutation, deleteSaleMutation };
}

