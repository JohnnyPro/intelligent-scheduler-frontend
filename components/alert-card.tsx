import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react"
import type { Alert } from "@/lib/types"
import { cn } from "@/lib/utils"

export function AlertCard({ alert }: { alert: Alert }) {
  const getIcon = () => {
    switch (alert.type) {
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "mb-3 rounded-md border p-4",
        alert.type === "error" && "border-l-4 border-l-red-500 bg-red-50",
        alert.type === "warning" && "border-l-4 border-l-amber-500 bg-amber-50",
        alert.type === "success" && "border-l-4 border-l-emerald-500 bg-emerald-50",
        alert.type === "info" && "border-l-4 border-l-blue-500 bg-blue-50",
      )}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="font-medium">{alert.title}</h4>
          <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
          {alert.actionLink && (
            <a
              href={alert.actionLink}
              className={cn(
                "mt-2 inline-block text-sm font-medium",
                alert.type === "error" && "text-red-600 hover:text-red-700",
                alert.type === "warning" && "text-amber-600 hover:text-amber-700",
                alert.type === "success" && "text-emerald-600 hover:text-emerald-700",
                alert.type === "info" && "text-blue-600 hover:text-blue-700",
              )}
            >
              {alert.actionText}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
