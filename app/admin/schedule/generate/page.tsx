"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Play, Settings, X } from "lucide-react"

export default function GenerateSchedulePage() {


  return (
    <DashboardLayout title="Generate Schedule">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Generate New Schedule</h2>
          <p className="text-gray-500">Configure and start a new schedule generation process</p>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            <TabsTrigger value="constraints">Constraints</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-name">Schedule Name</Label>
                    <Input id="schedule-name" placeholder="e.g., Fall 2025 - Initial Draft" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academic-term">Academic Term</Label>
                    <Select defaultValue="fall-2025">
                      <SelectTrigger id="academic-term">
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fall-2025">Fall 2025</SelectItem>
                        <SelectItem value="spring-2026">Spring 2026</SelectItem>
                        <SelectItem value="summer-2026">Summer 2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input id="description" placeholder="Brief description of this schedule run" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Validation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-emerald-50 p-3">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-emerald-800">All data is valid</h3>
                      <p className="mt-1 text-sm text-emerald-700">
                        All required data has been validated and is ready for schedule generation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="ml-2 font-medium">Courses & Sessions</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">142 courses with 356 sessions</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="ml-2 font-medium">Teachers</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">56 teachers with preferences</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="ml-2 font-medium">Rooms</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">38 rooms available</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="ml-2 font-medium">Student Groups</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">24 student groups</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="population-size">Population Size</Label>
                    <Input id="population-size" type="number" defaultValue="100" />
                    <p className="text-xs text-gray-500">Larger values may improve results but take longer</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-generations">Max Generations</Label>
                    <Input id="max-generations" type="number" defaultValue="1000" />
                    <p className="text-xs text-gray-500">Maximum number of generations to run</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mutation-rate">Mutation Rate</Label>
                    <Input id="mutation-rate" type="number" step="0.01" defaultValue="0.1" />
                    <p className="text-xs text-gray-500">Probability of mutation (0.0 to 1.0)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crossover-rate">Crossover Rate</Label>
                    <Input id="crossover-rate" type="number" step="0.01" defaultValue="0.8" />
                    <p className="text-xs text-gray-500">Probability of crossover (0.0 to 1.0)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                  <Input id="time-limit" type="number" defaultValue="30" />
                  <p className="text-xs text-gray-500">Maximum time to run the algorithm (0 for no limit)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fitness-threshold">Fitness Threshold</Label>
                  <Input id="fitness-threshold" type="number" step="0.01" defaultValue="0.95" />
                  <p className="text-xs text-gray-500">Stop when this fitness score is reached (0.0 to 1.0)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="constraints" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hard Constraints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center rounded-md border p-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <X className="h-3 w-3" />
                    </div>
                    <span className="ml-2">No teacher can teach multiple classes at the same time</span>
                  </div>
                  <div className="flex items-center rounded-md border p-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <X className="h-3 w-3" />
                    </div>
                    <span className="ml-2">No room can be used for multiple classes at the same time</span>
                  </div>
                  <div className="flex items-center rounded-md border p-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <X className="h-3 w-3" />
                    </div>
                    <span className="ml-2">No student group can have multiple classes at the same time</span>
                  </div>
                  <div className="flex items-center rounded-md border p-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <X className="h-3 w-3" />
                    </div>
                    <span className="ml-2">Room capacity must be sufficient for the student group size</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Soft Constraints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center rounded-md border p-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <Clock className="h-3 w-3" />
                    </div>
                    <span className="ml-2">Teacher preferences for time slots should be respected</span>
                  </div>
                  <div className="flex items-center rounded-md border p-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <Clock className="h-3 w-3" />
                    </div>
                    <span className="ml-2">Minimize gaps in student group schedules</span>
                  </div>
                  <div className="flex items-center rounded-md border p-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <Clock className="h-3 w-3" />
                    </div>
                    <span className="ml-2">Distribute classes evenly throughout the week</span>
                  </div>
                  <div className="flex items-center rounded-md border p-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <Clock className="h-3 w-3" />
                    </div>
                    <span className="ml-2">Prefer rooms with appropriate capacity (not too large)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Save as Template
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Play className="mr-2 h-4 w-4" />
              Start Generation
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
