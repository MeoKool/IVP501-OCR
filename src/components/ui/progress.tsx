import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary shadow-inner",
          className
        )}
        {...props}
      >
        <div
          className="relative h-full w-full flex-1 bg-gradient-to-r from-primary via-primary to-primary/90 transition-all duration-300 ease-out shadow-sm"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        >
          {percentage > 0 && percentage < 100 && (
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          )}
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
