import { cn } from "@/lib/utils"
import * as React from "react"

const Label = React.forwardRef<
  React.ElementRef<"label">,
  React.ComponentPropsWithoutRef<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-700 dark:text-neutral-300",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
