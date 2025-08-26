import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Input> & { wrapperClassName?: string }
>(({ className, wrapperClassName, type = "number", inputMode = "decimal", step = "0.01", ...props }, ref) => {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
      <Input
        ref={ref}
        type={type}
        inputMode={inputMode}
        step={step}
        className={cn("pl-8 text-right", className)}
        {...props}
      />
    </div>
  )
})
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
