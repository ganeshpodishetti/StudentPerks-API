import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-neutral-500 dark:placeholder:text-neutral-400 selection:bg-primary selection:text-primary-foreground dark:bg-neutral-800 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600 flex h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1 text-base text-neutral-900 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-gray-500 focus-visible:ring-gray-500/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
