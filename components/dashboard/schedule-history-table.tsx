import type { ScheduleResponse } from "@/lib/types/schedule.types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, Clock, Play, CheckCircle, Circle } from "lucide-react"

interface Props {
  schedules: ScheduleResponse[]
  onActivate: (id: string) => void
}

export function ScheduleHistoryTable({ schedules, onActivate }: Props) {
  return (
    <div className="space-y-3">
      {schedules.map((schedule) => (
        <div
          key={schedule.scheduleId}
          className={cn(
            "group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300",
            schedule.isActive && "ring-2 ring-emerald-500/30 border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-white"
          )}
        >
          <div className="flex items-center justify-between">
            {/* Left side - Schedule info */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Status indicator */}
              <div className="flex-shrink-0">
                {schedule.isActive ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Schedule details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="font-semibold text-gray-900 text-lg truncate">
                    {schedule.scheduleName}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      schedule.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {schedule.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Generated on {new Date(schedule.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3 ml-4">
              {!schedule.isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onActivate(schedule.scheduleId)}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 hover:border-emerald-300 transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </Button>
              )}

              {schedule.isActive && (
                <div className="text-sm text-emerald-600 font-medium">
                  Currently Active
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
