"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

type ScheduleDistribution = {
  maxDaysPerWeek: number
  maxConsecutiveSessions: number
  preferCompactSchedule: boolean
}

interface ScheduleDistributionProps {
  distribution: ScheduleDistribution
  onDistributionChange: (distribution: ScheduleDistribution) => void
}

export function ScheduleDistribution({ distribution, onDistributionChange }: ScheduleDistributionProps) {
  const updateDistribution = (updates: Partial<ScheduleDistribution>) => {
    onDistributionChange({ ...distribution, ...updates })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="max-days" className="text-base font-medium">
                Maximum Days Per Week
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="max-days"
                  min={1}
                  max={5}
                  step={1}
                  value={[distribution.maxDaysPerWeek]}
                  onValueChange={(value) => updateDistribution({ maxDaysPerWeek: value[0] })}
                  className="flex-1"
                />
                <span className="w-8 text-center font-medium">{distribution.maxDaysPerWeek}</span>
              </div>
              <p className="text-sm text-gray-500">Maximum number of days you want to come to campus per week</p>
            </div>

            <div className="space-y-4">
              <Label htmlFor="max-consecutive" className="text-base font-medium">
                Maximum Consecutive Sessions
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="max-consecutive"
                  min={1}
                  max={6}
                  step={1}
                  value={[distribution.maxConsecutiveSessions]}
                  onValueChange={(value) => updateDistribution({ maxConsecutiveSessions: value[0] })}
                  className="flex-1"
                />
                <span className="w-8 text-center font-medium">{distribution.maxConsecutiveSessions}</span>
              </div>
              <p className="text-sm text-gray-500">
                Maximum number of back-to-back teaching sessions you're comfortable with
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compact-schedule"
                  checked={distribution.preferCompactSchedule}
                  onCheckedChange={(checked) => updateDistribution({ preferCompactSchedule: checked === true })}
                />
                <Label htmlFor="compact-schedule" className="text-base font-medium">
                  Prefer compact schedule
                </Label>
              </div>
              <p className="text-sm text-gray-500 ml-6">
                When enabled, the system will try to group your classes together with minimal gaps between sessions
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-blue-900 mb-4">Current Preferences Summary</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-200 rounded-full p-1 mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-blue-800">
                    Maximum {distribution.maxDaysPerWeek} {distribution.maxDaysPerWeek === 1 ? "day" : "days"} per week
                  </span>
                  <p className="text-sm text-blue-700 mt-1">
                    You prefer to teach on no more than {distribution.maxDaysPerWeek}{" "}
                    {distribution.maxDaysPerWeek === 1 ? "day" : "days"} per week.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-200 rounded-full p-1 mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-blue-800">
                    Up to {distribution.maxConsecutiveSessions} consecutive{" "}
                    {distribution.maxConsecutiveSessions === 1 ? "session" : "sessions"}
                  </span>
                  <p className="text-sm text-blue-700 mt-1">
                    You prefer to teach no more than {distribution.maxConsecutiveSessions} classes back-to-back.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-200 rounded-full p-1 mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-blue-800">
                    {distribution.preferCompactSchedule
                      ? "Compact scheduling preferred"
                      : "No preference for compact scheduling"}
                  </span>
                  <p className="text-sm text-blue-700 mt-1">
                    {distribution.preferCompactSchedule
                      ? "You prefer to have your classes grouped together with minimal gaps."
                      : "You have no preference for how your classes are distributed throughout the day."}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
