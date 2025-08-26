import { formatCurrency } from "@/lib/utils";

interface SalesSummaryProps {
  summary: {
    totalRevenue: number;
    totalSold: number;
    profit: number;
    profitMargin: number;
  };
}

export function SalesSummary({ summary }: SalesSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
      <div className="text-center">
        <div className="text-sm text-muted-foreground">Total Revenue</div>
        <div className="text-lg font-semibold text-muted-foreground">
          {formatCurrency(summary.totalRevenue)}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground">Units Sold</div>
        <div className="text-lg font-semibold text-muted-foreground">
          {summary.totalSold}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground">Profit</div>
        <div className={`text-lg font-semibold ${summary.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(summary.profit)}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground">Margin</div>
        <div className={`text-lg font-semibold ${summary.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {summary.profitMargin.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

