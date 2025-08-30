import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

type CashDenominations = {
  notes100: number;
  notes50: number;
  notes20: number;
  notes10: number;
  notes5: number;
  coins2: number;
  coins1: number;
  coins050: number;
  coins020: number;
  coins010: number;
  coins005: number;
};

type CashCalculatorProps = {
  denominations: CashDenominations;
  onUpdate: (denoms: CashDenominations, total: number) => void;
};

const noteValues = [
  { key: "notes100" as const, label: "$100", value: 100 },
  { key: "notes50" as const, label: "$50", value: 50 },
  { key: "notes20" as const, label: "$20", value: 20 },
  { key: "notes10" as const, label: "$10", value: 10 },
  { key: "notes5" as const, label: "$5", value: 5 },
];

const coinValues = [
  { key: "coins2" as const, label: "$2", value: 2 },
  { key: "coins1" as const, label: "$1", value: 1 },
  { key: "coins050" as const, label: "$0.50", value: 0.5 },
  { key: "coins020" as const, label: "$0.20", value: 0.2 },
  { key: "coins010" as const, label: "$0.10", value: 0.1 },
  { key: "coins005" as const, label: "$0.05", value: 0.05 },
];

export function CashCalculator({ denominations, onUpdate }: CashCalculatorProps) {
  const [localDenominations, setLocalDenominations] = useState<CashDenominations>(denominations);

  useEffect(() => setLocalDenominations(denominations), [denominations]);

  const update = (key: keyof CashDenominations, qty: number) => {
    const updated = { ...localDenominations, [key]: Math.max(0, qty) };
    setLocalDenominations(updated);
    const notes = noteValues.reduce((s, n) => s + (updated[n.key] || 0) * n.value, 0);
    const coins = coinValues.reduce((s, c) => s + (updated[c.key] || 0) * c.value, 0);
    onUpdate(updated, notes + coins);
  };

  const notesTotal = noteValues.reduce((s, n) => s + (localDenominations[n.key] || 0) * n.value, 0);
  const coinsTotal = coinValues.reduce((s, c) => s + (localDenominations[c.key] || 0) * c.value, 0);
  const totalCash = notesTotal + coinsTotal;

  // Row layout: [1fr | auto | 1fr] so the middle column is *exactly center* of the row.
  const rowClass = "grid grid-cols-[1fr_auto_1fr] items-center p-3 bg-card rounded-lg border border-border";
  const totalClass = "text-sm text-foreground w-14 sm:w-16 text-right justify-self-end";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Notes */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Australian Notes</h3>
        <div className="space-y-3">
          {noteValues.map((note) => {
            const qty = localDenominations[note.key] || 0;
            const sub = qty * note.value;
            return (
              <div key={note.key} className={rowClass}>
                <span className="text-sm font-medium text-card-foreground min-w-0">{note.label}</span>
                <div className="justify-self-center">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={qty || ""}
                    onChange={(e) => update(note.key, parseInt(e.target.value) || 0)}
                    className="w-16 text-center text-base bg-input text-foreground border-border"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <span className={totalClass}>{formatCurrency(sub)}</span>
              </div>
            );
          })}
          <div className="border-t border-border pt-3">
            <div className={rowClass + " p-3 !bg-transparent !border-0"}>
              <span className="text-sm font-medium text-muted-foreground">Notes Total:</span>
              <span className="justify-self-center" />
              <span className={totalClass + " text-foreground"}>{formatCurrency(notesTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coins */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Australian Coins</h3>
        <div className="space-y-3">
          {coinValues.map((coin) => {
            const qty = localDenominations[coin.key] || 0;
            const sub = qty * coin.value;
            return (
              <div key={coin.key} className={rowClass}>
                <span className="text-sm font-medium text-card-foreground min-w-0">{coin.label}</span>
                <div className="justify-self-center">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={qty || ""}
                    onChange={(e) => update(coin.key, parseInt(e.target.value) || 0)}
                    className="w-16 text-center text-base bg-input text-foreground border-border"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <span className={totalClass}>{formatCurrency(sub)}</span>
              </div>
            );
          })}
          <div className="border-t border-border pt-3">
            <div className={rowClass + " p-3 !bg-transparent !border-0"}>
              <span className="text-sm font-medium text-foreground">Coins Total:</span>
              <span className="justify-self-center" />
              <span className={totalClass + " text-foreground"}>{formatCurrency(coinsTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Total */}
      <div className="md:col-spoan-2 border-t-2 border-primary pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">Total Cash on Hand:</span>
          <span className="text-2xl font-bold text-primary">{formatCurrency(totalCash)}</span>
        </div>
      </div>
    </div>
  );
}
