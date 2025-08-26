import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ClearDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  pending: boolean;
}

export function ClearDataDialog({ open, onOpenChange, onConfirm, pending }: ClearDataDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear All Data</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          Are you sure you want to clear all financial data? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={pending}>
            {pending ? "Clearing..." : "Clear All"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

