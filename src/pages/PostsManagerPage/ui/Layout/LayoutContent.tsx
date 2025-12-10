import * as React from "react"
import { forwardRef } from "react"

export const LayoutContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
  ),
)

LayoutContent.displayName = "LayoutContent"

