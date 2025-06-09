import { BookOpen, Home, School, Users, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Metric } from "@/lib/types"

export function MetricCard({ metric }: { metric: Metric }) {
  const getIcon = () => {
    switch (metric.icon) {
      case "courses":
        return <BookOpen className="h-8 w-8 text-indigo-600" />
      case "teachers":
        return <Users className="h-8 w-8 text-amber-600" />
      case "rooms":
        return <Home className="h-8 w-8 text-emerald-600" />
      case "student-groups":
        return <School className="h-8 w-8 text-violet-600" />
      default:
        return <BookOpen className="h-8 w-8 text-indigo-600" />
    }
  }

  const getChangeIcon = () => {
    switch (metric.change.type) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-emerald-600" />
      case "decrease":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "no-change":
        return <Minus className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{metric.title}</p>
          <p className="text-3xl font-bold">{metric.value}</p>
          <div className="flex items-center gap-1 text-xs">
            {getChangeIcon()}
            <span
              className={cn(
                metric.change.type === "increase" && "text-emerald-600",
                metric.change.type === "decrease" && "text-red-600",
                metric.change.type === "no-change" && "text-gray-500",
              )}
            >
              {metric.change.value}
            </span>
          </div>
        </div>
        <div className="rounded-full p-2">{getIcon()}</div>
      </CardContent>
    </Card>
  )
}
