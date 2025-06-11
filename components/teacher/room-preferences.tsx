"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useMemo } from "react"
import { Classroom } from "@/lib/types"

type RoomPreference = {
  classroomId: string
  preference: "prefer" | "avoid"
}

interface RoomPreferencesProps {
  rooms: Classroom[]
  preferences: RoomPreference[]
  onPreferencesChange: (preferences: RoomPreference[]) => void
}

export function RoomPreferences({ rooms, preferences, onPreferencesChange }: RoomPreferencesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMode, setSelectedMode] = useState<"prefer" | "avoid">("prefer")

  // Group rooms by building
  const roomsByBuilding = useMemo(() => {
    const filtered = rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.building?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.campus.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return filtered.reduce(
      (acc, room) => {
        const buildingName = room.building?.name || ""
        if (!acc[buildingName]) {
          acc[buildingName] = []
        }
        acc[buildingName].push(room)
        return acc
      },
      {} as Record<string, Classroom[]>,
    )
  }, [rooms, searchTerm])

  const getRoomPreference = (classroomId: string): "prefer" | "avoid" | "neutral" => {
    const pref = preferences.find((p) => p.classroomId === classroomId)
    return pref?.preference || "neutral"
  }

  const updateRoomPreference = (classroomId: string, preference: "prefer" | "avoid" | "neutral") => {
    const newPreferences = preferences.filter((p) => p.classroomId !== classroomId)
    if (preference !== "neutral") {
      newPreferences.push({ classroomId, preference })
    }
    onPreferencesChange(newPreferences)
  }

  const handleRoomClick = (classroomId: string) => {
    const currentPreference = getRoomPreference(classroomId)
    if (currentPreference === selectedMode) {
      updateRoomPreference(classroomId, "neutral")
    } else {
      updateRoomPreference(classroomId, selectedMode)
    }
  }

  const clearAll = () => {
    onPreferencesChange([])
  }

  const formatRoomType = (type: string) => {
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Preferences</CardTitle>
        <div className="flex items-center justify-between">
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
          </div>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search rooms..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
          {Object.entries(roomsByBuilding).map(([buildingName, buildingRooms]) => (
            <div key={buildingName} className="space-y-3">
              <h3 className="font-medium text-lg border-b pb-2">{buildingName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {buildingRooms.map((room) => {
                  const preference = getRoomPreference(room.classroomId)
                  return (
                    <button
                      key={room.classroomId}
                      onClick={() => handleRoomClick(room.classroomId)}
                      className={cn(
                        "p-3 text-left border rounded-lg transition-colors hover:opacity-80",
                        preference === "prefer" && "bg-emerald-50 border-emerald-300",
                        preference === "avoid" && "bg-red-50 border-red-300",
                        preference === "neutral" && "bg-white border-gray-200 hover:bg-gray-50",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{room.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Floor {room.floor} • {formatRoomType(room.type)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Capacity: {room.capacity} • {room.campus.name}
                          </div>
                          {room.isWheelchairAccessible && (
                            <div className="mt-1">
                              <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                Wheelchair Accessible
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-2">
                          {preference === "prefer" && (
                            <div className="w-6 h-6 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 text-xs">✓</span>
                            </div>
                          )}
                          {preference === "avoid" && (
                            <div className="w-6 h-6 bg-red-100 border border-red-300 rounded-full flex items-center justify-center">
                              <span className="text-red-600 text-xs">✗</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded"></div>
            <span>Prefer to teach in</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Avoid teaching in</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
