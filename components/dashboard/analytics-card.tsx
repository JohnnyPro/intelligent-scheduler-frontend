import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RoomUtilizationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Room Utilization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] rounded-md bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Room utilization chart will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ScheduleQualityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Schedule Quality Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] rounded-md bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Schedule quality metrics will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )
}
