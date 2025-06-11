import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type CurrentScheduleProps = {
  name: string
  lastUpdated: string
}

export function CurrentScheduleCard({ name, lastUpdated }: CurrentScheduleProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        <div className="mt-4 flex gap-3">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Calendar className="mr-2 h-4 w-4" />
            Start New Generation
          </Button>
          <Button variant="outline">View Full Schedule</Button>
        </div>
      </CardContent>
    </Card>
  )
}
