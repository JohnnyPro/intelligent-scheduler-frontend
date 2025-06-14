import type { ScheduleResponse } from "@/lib/types/schedule.types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface Props {
  schedules: ScheduleResponse[]
  onActivate: (id: string) => void
  onDelete: (id: string) => void
}

export function ScheduleHistoryTable({ schedules, onActivate, onDelete }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">NAME</TableHead>
            <TableHead>GENERATED DATE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.scheduleId}>
              <TableCell className="font-medium">{schedule.scheduleName}</TableCell>
              <TableCell>{new Date(schedule.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                    schedule.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                  )}
                >
                  {schedule.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {!schedule.isActive && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onActivate(schedule.scheduleId)}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      Activate
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(schedule.scheduleId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
