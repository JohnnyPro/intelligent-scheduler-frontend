import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CurrentScheduleProps = {
  name: string
  lastUpdated: string
}

export function CurrentScheduleCard({ name, lastUpdated }: CurrentScheduleProps) {
  return (
    <Card className="relative overflow-hidden border-l-4 border-l-green-500 shadow-lg">
      <div className="absolute left-0 top-0 h-full w-1 bg-green-500"></div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">Currently Active Schedule</CardTitle>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            Active
          </span>
        </div>
        <p className="text-lg font-medium text-gray-700 mt-1">{name}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
          Generated on: {lastUpdated}
        </div>
      </CardContent>
    </Card>
  )
}
