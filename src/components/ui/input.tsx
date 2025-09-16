import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 border-2 border-black bg-input px-4 py-3 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 font-bold transition-none shadow-[4px_4px_0px_0px_#000000] focus:shadow-[2px_2px_0px_0px_#000000] focus:translate-x-[2px] focus:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
