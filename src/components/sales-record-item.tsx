import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { SalesRecord } from "@shared/schema";

interface SalesRecordItemProps {
  record: SalesRecord;
  onDelete: () => void;
}

export function SalesRecordItem({ record, onDelete }: SalesRecordItemProps) {
  return (
    <div className="p-4 rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {record.qty} units
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(record.createdAt!).toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Price:</span>
              <div className="font-medium text-muted-foreground">
                {formatCurrency(parseFloat(record.totalPrice))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Amount Paid:</span>
              <div className="font-medium text-muted-foreground">
                {formatCurrency(parseFloat(record.amountPaid))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Balance Owing:</span>
              <div className={`font-medium ${parseFloat(record.balanceOwing) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(parseFloat(record.balanceOwing))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Unit Price:</span>
              <div className="font-medium text-muted-foreground">
                {formatCurrency(parseFloat(record.totalPrice) / record.qty)}
              </div>
            </div>
          </div>

          {record.notes && (
            <>
              <Separator className="my-3" />
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{record.notes}</span>
              </div>
            </>
          )}
        </div>

        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          className="h-8 px-2 ml-4"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

