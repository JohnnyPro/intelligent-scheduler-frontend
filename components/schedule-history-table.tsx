import type { Schedule } from "@/lib/stores/store"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export function ScheduleHistoryTable({ schedules }: { schedules: Schedule[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">NAME</TableHead>
            <TableHead>DATE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>FITNESS SCORE</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell className="font-medium">{schedule.name}</TableCell>
              <TableCell>{schedule.date}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                    schedule.status === "Completed" && "bg-emerald-100 text-emerald-700",
                    schedule.status === "Failed" && "bg-red-100 text-red-700",
                    schedule.status === "Published" && "bg-blue-100 text-blue-700",
                    schedule.status === "In Progress" && "bg-amber-100 text-amber-700",
                  )}
                >
                  {schedule.status}
                </span>
              </TableCell>
              <TableCell>{schedule.fitnessScore || "N/A"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  {schedule.status === "Completed" && (
                    <>
                      <Button variant="outline" size="sm">
                        Duplicate
                      </Button>
                      <Button variant="outline" size="sm" className="text-emerald-600 hover:text-emerald-700">
                        Publish
                      </Button>
                    </>
                  )}
                  {schedule.status === "Failed" && (
                    <>
                      <Button variant="outline" size="sm">
                        Logs
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Delete
                      </Button>
                    </>
                  )}
                  {schedule.status === "Published" && (
                    <Button variant="outline" size="sm">
                      Duplicate
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
