import React from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/utils'

const toastVariants = cva(
  "fixed bottom-4 right-4 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100",
        success: "bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100",
        error: "bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100",
        warning: "bg-yellow-100 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100",
        destructive: "bg-red-600 text-white dark:bg-red-600 dark:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'destructive'

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description: string
  variant?: ToastVariant
  onClose: () => void
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, variant = 'default', onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex-1 ml-3 text-sm font-normal">
          {title && <div className="text-sm font-semibold text-gray-900 dark:text-white">{title}</div>}
          <div className="text-sm font-normal">{description}</div>
        </div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="Close"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <X className="w-5 h-5" />
        </button>
      </div>
    )
  }
)

Toast.displayName = "Toast"