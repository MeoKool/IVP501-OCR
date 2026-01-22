import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onClose: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "default"
          ? "border bg-background text-foreground"
          : "destructive group border-destructive bg-destructive text-destructive-foreground"
      )}
    >
      <div className="grid gap-1">
        {title && (
          <div className="text-sm font-semibold">{title}</div>
        )}
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      <button
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

const ToastContext = React.createContext<{
  toast: (props: Omit<ToastProps, "id" | "onClose">) => void
  toasts: ToastProps[]
}>({
  toast: () => {},
  toasts: [],
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback(
    ({ title, description, variant }: Omit<ToastProps, "id" | "onClose">) => {
      const id = Math.random().toString(36).substring(7)
      const onClose = () => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }
      setToasts((prev) => [...prev, { id, title, description, variant, onClose }])
      setTimeout(() => {
        onClose()
      }, 5000)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
