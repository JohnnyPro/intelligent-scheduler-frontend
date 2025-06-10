"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type TimeSlot = {
  timeslotId: string
  code: string
  label: string
  startTime: string
  endTime: string
  order: number
}

type TimePreference = {
  day: string
  timeslotId: string
  preference: "prefer" | "avoid" | "neutral"
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

interface TimePreferenceGridProps {
  timeslots: TimeSlot[]
  preferences: TimePreference[]
  onPreferencesChange: (preferences: TimePreference[]) => void
}

export function TimePreferenceGrid({ timeslots, preferences, onPreferencesChange }: TimePreferenceGridProps) {
  const [selectedMode, setSelectedMode] = useState<"prefer" | "avoid" | "neutral">("prefer")
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ day: string; timeslotId: string } | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<{ day: string; timeslotId: string } | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const getPreference = (day: string, timeslotId: string): "prefer" | "avoid" | "neutral" => {
    const slot = preferences.find((p) => p.day === day && p.timeslotId === timeslotId)
    return slot?.preference || "neutral"
  }

  const updatePreference = (day: string, timeslotId: string, preference: "prefer" | "avoid" | "neutral") => {
    const newPreferences = preferences.filter((p) => !(p.day === day && p.timeslotId === timeslotId))
    if (preference !== "neutral") {
      newPreferences.push({ day, timeslotId, preference })
    }
    onPreferencesChange(newPreferences)
  }

  const updateMultiplePreferences = (
    selections: Array<{ day: string; timeslotId: string }>,
    preference: "prefer" | "avoid" | "neutral",
  ) => {
    let newPreferences = [...preferences]

    // Remove existing preferences for selected cells
    selections.forEach(({ day, timeslotId }) => {
      newPreferences = newPreferences.filter((p) => !(p.day === day && p.timeslotId === timeslotId))
    })

    // Add new preferences if not neutral
    if (preference !== "neutral") {
      selections.forEach(({ day, timeslotId }) => {
        newPreferences.push({ day, timeslotId, preference })
      })
    }

    onPreferencesChange(newPreferences)
  }

  const getCellsInSelection = useCallback(() => {
    if (!selectionStart || !selectionEnd) return []

    const startDayIndex = weekDays.indexOf(selectionStart.day)
    const endDayIndex = weekDays.indexOf(selectionEnd.day)
    const startTimeIndex = timeslots.findIndex((t) => t.timeslotId === selectionStart.timeslotId)
    const endTimeIndex = timeslots.findIndex((t) => t.timeslotId === selectionEnd.timeslotId)

    const minDayIndex = Math.min(startDayIndex, endDayIndex)
    const maxDayIndex = Math.max(startDayIndex, endDayIndex)
    const minTimeIndex = Math.min(startTimeIndex, endTimeIndex)
    const maxTimeIndex = Math.max(startTimeIndex, endTimeIndex)

    const cells = []
    for (let dayIndex = minDayIndex; dayIndex <= maxDayIndex; dayIndex++) {
      for (let timeIndex = minTimeIndex; timeIndex <= maxTimeIndex; timeIndex++) {
        cells.push({
          day: weekDays[dayIndex],
          timeslotId: timeslots[timeIndex].timeslotId,
        })
      }
    }
    return cells
  }, [selectionStart, selectionEnd, timeslots])

  const isInSelection = (day: string, timeslotId: string) => {
    if (!isSelecting || !selectionStart || !selectionEnd) return false
    const cellsInSelection = getCellsInSelection()
    return cellsInSelection.some((cell) => cell.day === day && cell.timeslotId === timeslotId)
  }

  const handleMouseDown = (day: string, timeslotId: string) => {
    setIsSelecting(true)
    setSelectionStart({ day, timeslotId })
    setSelectionEnd({ day, timeslotId })
  }

  const handleMouseEnter = (day: string, timeslotId: string) => {
    if (isSelecting && selectionStart) {
      setSelectionEnd({ day, timeslotId })
    }
  }

  const handleMouseUp = () => {
    if (isSelecting && selectionStart && selectionEnd) {
      const cellsInSelection = getCellsInSelection()
      if (cellsInSelection.length === 1) {
        // Single cell click
        const { day, timeslotId } = cellsInSelection[0]
        const currentPreference = getPreference(day, timeslotId)
        if (currentPreference === selectedMode) {
          updatePreference(day, timeslotId, "neutral")
        } else {
          updatePreference(day, timeslotId, selectedMode)
        }
      } else {
        // Multiple cell selection
        updateMultiplePreferences(cellsInSelection, selectedMode)
      }
    }
    setIsSelecting(false)
    setSelectionStart(null)
    setSelectionEnd(null)
  }

  const clearAll = () => {
    onPreferencesChange([])
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button
              variant={selectedMode === "prefer" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMode("prefer")}
              className={selectedMode === "prefer" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              Prefer
            </Button>
            <Button
              variant={selectedMode === "avoid" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMode("avoid")}
              className={selectedMode === "avoid" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Avoid
            </Button>
            <Button
              variant={selectedMode === "neutral" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMode("neutral")}
            >
              Clear
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Click and drag to select multiple time slots. Hold and drag to select a rectangle of time slots.
        </p>

        <div className="overflow-x-auto">
          <div
            ref={gridRef}
            className="grid grid-cols-6 gap-1 min-w-[800px] select-none"
            onMouseLeave={() => {
              if (isSelecting) {
                handleMouseUp()
              }
            }}
          >
            {/* Header row */}
            <div className="p-2 text-center font-medium text-sm">Time</div>
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center font-medium text-sm">
                {day}
              </div>
            ))}

            {/* Time slot rows */}
            {timeslots.map((timeslot) => (
              <div key={timeslot.timeslotId} className="contents">
                <div className="p-2 text-center text-sm font-medium bg-gray-50 border rounded">{timeslot.label}</div>
                {weekDays.map((day) => {
                  const preference = getPreference(day, timeslot.timeslotId)
                  const inSelection = isInSelection(day, timeslot.timeslotId)
                  return (
                    <button
                      key={`${day}-${timeslot.timeslotId}`}
                      onMouseDown={() => handleMouseDown(day, timeslot.timeslotId)}
                      onMouseEnter={() => handleMouseEnter(day, timeslot.timeslotId)}
                      onMouseUp={handleMouseUp}
                      className={cn(
                        "p-2 text-xs border rounded transition-colors hover:opacity-80 cursor-pointer",
                        preference === "prefer" && "bg-emerald-100 border-emerald-300 text-emerald-800",
                        preference === "avoid" && "bg-red-100 border-red-300 text-red-800",
                        preference === "neutral" && "bg-white border-gray-200 hover:bg-gray-50",
                        inSelection && "ring-2 ring-blue-400 ring-opacity-50 bg-blue-50",
                      )}
                    >
                      {preference === "prefer" && "✓"}
                      {preference === "avoid" && "✗"}
                      {preference === "neutral" && ""}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
