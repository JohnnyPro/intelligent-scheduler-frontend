"use client"

import { TeacherLayout } from "@/components/layout/teacher-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Grid, List, Printer, Search } from "lucide-react"

export default function TeacherSchedulePage() {
  return (
    <TeacherLayout title="My Schedule">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Teaching Schedule</h2>
            <p className="text-gray-500">Fall 2025 - Current Schedule</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search courses..." className="pl-8" />
              </div>
              <Select defaultValue="all-courses">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-courses">All Courses</SelectItem>
                  <SelectItem value="calculus-ii">Calculus II</SelectItem>
                  <SelectItem value="linear-algebra">Linear Algebra</SelectItem>
                  <SelectItem value="statistics">Statistics</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="current-week">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-week">Current Week</SelectItem>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="current-semester">Current Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Schedule View */}
        <div className="rounded-md border bg-white">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">November 18 - November 24, 2024</span>
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

          {/* Calendar Grid */}
          <div className="grid grid-cols-6 border-b">
            <div className="p-2 text-center font-medium text-sm border-r">Time</div>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <div key={day} className="border-r p-2 text-center font-medium text-sm last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-6">
            {Array.from({ length: 12 }).map((_, hourIndex) => (
              <div key={hourIndex} className="contents">
                <div className="border-b border-r p-2 text-center text-sm font-medium bg-gray-50">
                  {8 + hourIndex}:00
                </div>
                {Array.from({ length: 5 }).map((_, dayIndex) => (
                  <div key={`${dayIndex}-${hourIndex}`} className="border-b border-r p-1 min-h-[4rem] last:border-r-0">
                    {/* Sample schedule items for teacher */}
                    {dayIndex === 1 && hourIndex === 2 && (
                      <div className="rounded bg-emerald-100 border border-emerald-300 p-2 text-xs">
                        <div className="font-medium text-emerald-800">Calculus II</div>
                        <div className="text-emerald-600">Room 205 • MATH-Y2</div>
                        <div className="text-emerald-600">45 students</div>
                      </div>
                    )}
                    {dayIndex === 3 && hourIndex === 4 && (
                      <div className="rounded bg-emerald-100 border border-emerald-300 p-2 text-xs">
                        <div className="font-medium text-emerald-800">Linear Algebra</div>
                        <div className="text-emerald-600">Room 302 • MATH-Y3</div>
                        <div className="text-emerald-600">32 students</div>
                      </div>
                    )}
                    {dayIndex === 0 && hourIndex === 1 && (
                      <div className="rounded bg-emerald-100 border border-emerald-300 p-2 text-xs">
                        <div className="font-medium text-emerald-800">Statistics</div>
                        <div className="text-emerald-600">Room 150 • MATH-Y2</div>
                        <div className="text-emerald-600">38 students</div>
                      </div>
                    )}
                    {dayIndex === 2 && hourIndex === 3 && (
                      <div className="rounded bg-emerald-100 border border-emerald-300 p-2 text-xs">
                        <div className="font-medium text-emerald-800">Calculus II</div>
                        <div className="text-emerald-600">Room 205 • MATH-Y2</div>
                        <div className="text-emerald-600">45 students</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Classes:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Teaching Days:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Hours:</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Calculus II:</span>
                  <span className="font-medium">3 sessions</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Linear Algebra:</span>
                  <span className="font-medium">2 sessions</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Statistics:</span>
                  <span className="font-medium">3 sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Room 205:</span>
                  <span className="font-medium">4 sessions</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Room 302:</span>
                  <span className="font-medium">2 sessions</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Room 150:</span>
                  <span className="font-medium">2 sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  )
}
