import * as React from "react"
import { forwardRef } from "react"

export const LayoutHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
  ),
)

LayoutHeader.displayName = "LayoutHeader"

