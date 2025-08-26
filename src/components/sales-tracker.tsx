import { useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { useSalesRecords } from "@/hooks/use-sales-records";
import { SalesSummary } from "./sales-summary";
import { SalesRecordItem } from "./sales-record-item";
import type { InsertSalesRecord, InventoryBatch, SalesRecord } from "@shared/schema";

interface SalesTrackerProps {
  selectedBatch?: InventoryBatch;
}

export function SalesTracker({ selectedBatch }: SalesTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    qty: "",
    pricePerUnit: "",
    totalPrice: "",
    amountPaid: "",
    notes: "",
  });
  const { salesRecords, isLoading, addSaleMutation, deleteSaleMutation } = useSalesRecords(selectedBatch);

  const resetForm = () => {
    setFormData({
      qty: "",
      pricePerUnit: "",
      totalPrice: "",
      amountPaid: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;
    
    const qty = parseInt(formData.qty) || 0;
    const totalPrice = parseFloat(formData.totalPrice) || 0;
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    const balanceOwing = totalPrice - amountPaid;
    
    if (qty > selectedBatch.qtyInStock) {
      alert(`Cannot sell ${qty} units. Only ${selectedBatch.qtyInStock} units in stock.`);
      return;
    }
    
    const pricePerUnit = parseFloat(formData.pricePerUnit) || (totalPrice / qty);
    
    const saleData: InsertSalesRecord = {
      batchId: selectedBatch.id,
      qty,
      pricePerUnit: pricePerUnit.toString(),
      totalPrice: totalPrice.toString(),
      amountPaid: amountPaid.toString(),
      balanceOwing: balanceOwing.toString(),
      notes: formData.notes,
      userId: "46429020",
    };

    addSaleMutation.mutate(saleData, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        resetForm();
      },
    });
  };

  const calculateBalance = () => {
    const total = parseFloat(formData.totalPrice) || 0;
    const paid = parseFloat(formData.amountPaid) || 0;
    return total - paid;
  };

  const calculateSummary = () => {
    if (!selectedBatch || salesRecords.length === 0) {
      return {
        totalRevenue: 0,
        totalPaid: 0,
        totalOwing: 0,
        totalSold: 0,
        averagePrice: 0,
        profit: 0,
        profitMargin: 0,
      };
    }

    const totalRevenue = salesRecords.reduce((sum: number, record: SalesRecord) => sum + parseFloat(record.totalPrice), 0);
    const totalPaid = salesRecords.reduce((sum: number, record: SalesRecord) => sum + parseFloat(record.amountPaid), 0);
    const totalOwing = salesRecords.reduce((sum: number, record: SalesRecord) => sum + parseFloat(record.balanceOwing), 0);
    const totalSold = salesRecords.reduce((sum: number, record: SalesRecord) => sum + record.qty, 0);
    const averagePrice = totalSold > 0 ? totalRevenue / totalSold : 0;
    
    const costOfGoodsSold = totalSold * parseFloat(selectedBatch.unitCost);
    const profit = totalRevenue - costOfGoodsSold;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalPaid,
      totalOwing,
      totalSold,
      averagePrice,
      profit,
      profitMargin,
    };
  };

  const summary = calculateSummary();

  if (!selectedBatch) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p>Select an inventory batch to track sales</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <CardTitle className="text-muted-foreground">
              Sales Tracker - {selectedBatch.batchName}
            </CardTitle>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-2 border-primary/20">
              <DialogHeader>
                <DialogTitle className="text-muted-foreground">Record New Sale</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qty" className="text-sm text-muted-foreground">
                      Quantity Sold
                    </Label>
                    <Input
                      id="qty"
                      type="number"
                      value={formData.qty}
                      onChange={(e) => {
                        const qty = e.target.value;
                        const total = formData.totalPrice;
                        setFormData(prev => ({ 
                          ...prev, 
                          qty,
                          pricePerUnit: parseInt(qty) > 0 && total ? (parseFloat(total) / parseInt(qty)).toString() : "0"
                        }));
                      }}
                      placeholder="0"
                      max={selectedBatch.qtyInStock}
                      className="bg-input border-primary/30 text-foreground"
                      required
                    />
                    <div className="text-xs text-muted-foreground">
                      Available: {selectedBatch.qtyInStock} units
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalPrice" className="text-sm text-muted-foreground">
                      Total Price
                    </Label>
                    <CurrencyInput
                      id="totalPrice"
                      value={formData.totalPrice}
                      onChange={(e) => {
                        const total = e.target.value;
                        const qty = parseInt(formData.qty) || 0;
                        setFormData(prev => ({
                          ...prev,
                          totalPrice: total,
                          pricePerUnit: qty > 0 && total ? (parseFloat(total) / qty).toString() : "0"
                        }));
                      }}
                      placeholder="0.00"
                      className="bg-input border-primary/30 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Price Per Unit (Auto-calculated)</Label>
                    <div className="flex items-center h-10 px-3 rounded-md border border-primary/30 bg-muted text-muted-foreground">
                      {formData.qty && formData.totalPrice ? 
                        formatCurrency(parseFloat(formData.totalPrice) / parseInt(formData.qty)) : 
                        formatCurrency(0)
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Projected: {formatCurrency(parseFloat(selectedBatch.projectedSaleCostPerUnit || "0"))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amountPaid" className="text-sm text-muted-foreground">
                      Amount Paid
                    </Label>
                    <CurrencyInput
                      id="amountPaid"
                      value={formData.amountPaid}
                      onChange={(e) => setFormData(prev => ({ ...prev, amountPaid: e.target.value }))}
                      placeholder="0.00"
                      className="bg-input border-primary/30 text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Balance Owing (Auto)</Label>
                    <div className="flex items-center h-10 px-3 rounded-md border border-primary/30 bg-muted text-muted-foreground">
                      {formatCurrency(calculateBalance())}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm text-muted-foreground">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Customer details, payment method, etc."
                    className="bg-input border-primary/30 text-foreground resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addSaleMutation.isPending}
                  >
                    {addSaleMutation.isPending ? "Saving..." : "Record Sale"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Sales Summary */}
        <SalesSummary summary={summary} />

        {/* Sales Records */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading sales records...</div>
        ) : salesRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No sales recorded yet. Add your first sale to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {salesRecords.map((record: SalesRecord) => (
              <SalesRecordItem
                key={record.id}
                record={record}
                onDelete={() => {
                  if (confirm("Delete this sales record?")) {
                    deleteSaleMutation.mutate(record.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}