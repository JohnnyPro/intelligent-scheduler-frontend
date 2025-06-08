import type { Metadata } from "next"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Grid, List, Printer } from "lucide-react"

export const metadata: Metadata = {
  title: "View Schedule | Intelligent Scheduling System",
  description: "View and manage schedules in the Intelligent Scheduling System",
}

export default function ViewSchedulePage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="View Schedule" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Fall 2025 - Initial Draft</h2>
                <p className="text-gray-500">Generated on May 15, 2025</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-md border bg-white">
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">May 15 - May 21, 2025</span>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    Today
                  </Button>
                  <div className="flex rounded-md border">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-l-md border-r">
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-r-md bg-gray-100">
                      <Grid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-7 border-b">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="border-r p-2 text-center font-medium last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 grid-rows-[repeat(12,minmax(5rem,1fr))]">
                {Array.from({ length: 7 }).map((_, dayIndex) =>
                  Array.from({ length: 12 }).map((_, hourIndex) => (
                    <div
                      key={`${dayIndex}-${hourIndex}`}
                      className="border-b border-r p-1 last:border-r-0"
                      style={{ gridColumn: dayIndex + 1, gridRow: hourIndex + 1 }}
                    >
                      <div className="text-xs text-gray-500">{8 + hourIndex}:00</div>
                      {/* Sample schedule items */}
                      {dayIndex === 1 && hourIndex === 2 && (
                        <div className="mt-1 rounded bg-blue-100 p-1 text-xs">
                          <div className="font-medium">Introduction to Computer Science</div>
                          <div>Room 101 • Prof. Smith</div>
                        </div>
                      )}
                      {dayIndex === 3 && hourIndex === 4 && (
                        <div className="mt-1 rounded bg-green-100 p-1 text-xs">
                          <div className="font-medium">Data Structures</div>
                          <div>Room 205 • Prof. Johnson</div>
                        </div>
                      )}
                      {dayIndex === 0 && hourIndex === 1 && (
                        <div className="mt-1 rounded bg-purple-100 p-1 text-xs">
                          <div className="font-medium">Algorithms</div>
                          <div>Room 302 • Prof. Williams</div>
                        </div>
                      )}
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
