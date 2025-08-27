import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap
   rounded-full text-sm font-medium leading-none
   h-10 px-5
   ring-offset-background transition-colors
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-50
   touch-manipulation [-webkit-tap-highlight-color:transparent]
   [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
   text-[hsl(224_74%_16%)]
   bg-[linear-gradient(90deg,hsl(217_83%_56%),hsl(169_91%_55%))]
   bg-no-repeat [background-size:100%_100%] [background-position:center]`,
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        secondary: "",
        outline: "bg-none bg-transparent border border-primary",
        ghost: "",
        link: "bg-none underline underline-offset-4",
        income: "bg-none bg-transparent border border-primary",
        expense: "bg-none bg-transparent border border-primary",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4",
        lg: "h-11 px-6",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
