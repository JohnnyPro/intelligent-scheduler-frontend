"use client"

import { useState } from "react"
import { useStore } from "@/lib/stores/store"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Filter, Plus, Search, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import useAuthStore from "@/lib/stores/auth-store"

export default function RoomsPage() {
  const { isAuthenticated } = useAuthStore()

  const { rooms, buildings, addRoom, updateRoom, deleteRoom } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    building: "",
    floor: 1,
    type: "Lecture Hall" as "Lecture Hall" | "Laboratory" | "Seminar Room" | "Computer Lab",
    isAccessible: false,
    facilities: [] as string[],
  })
  const [facilityInput, setFacilityInput] = useState("")

  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleAddRoom = () => {
    addRoom(formData)
    setFormData({
      name: "",
      capacity: 0,
      building: "",
      floor: 1,
      type: "Lecture Hall",
      isAccessible: false,
      facilities: [],
    })
    setIsAddDialogOpen(false)
  }

  const handleEditRoom = () => {
    if (selectedRoom) {
      updateRoom(selectedRoom, formData)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteRoom = () => {
    if (selectedRoom) {
      deleteRoom(selectedRoom)
      setIsDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (id: string) => {
    const room = rooms.find((r) => r.id === id)
    if (room) {
      setSelectedRoom(id)
      setFormData({
        name: room.name,
        capacity: room.capacity,
        building: room.building,
        floor: room.floor,
        type: room.type,
        isAccessible: room.isAccessible,
        facilities: [...room.facilities],
      })
      setIsEditDialogOpen(true)
    }
  }

  const openDeleteDialog = (id: string) => {
    setSelectedRoom(id)
    setIsDeleteDialogOpen(true)
  }

  const addFacility = () => {
    if (facilityInput.trim() !== "") {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityInput.trim()],
      })
      setFacilityInput("")
    }
  }

  const removeFacility = (index: number) => {
    const newFacilities = [...formData.facilities]
    newFacilities.splice(index, 1)
    setFormData({
      ...formData,
      facilities: newFacilities,
    })
  }

  return (
    <DashboardLayout title="Rooms">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Rooms</h2>
          <div className="flex gap-3">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search rooms..." className="w-full pl-8" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>CAPACITY</TableHead>
                <TableHead>BUILDING</TableHead>
                <TableHead>FLOOR</TableHead>
                <TableHead>TYPE</TableHead>
                <TableHead>ACCESSIBILITY</TableHead>
                <TableHead>FACILITIES</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.id}</TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.building}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.isAccessible ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {room.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(room.id)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => openDeleteDialog(room.id)}
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
      </div>

      {/* Add Room Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Select
                value={formData.building}
                onValueChange={(value) => setFormData({ ...formData, building: value })}
              >
                <SelectTrigger id="building">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.name}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Room Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "Lecture Hall" | "Laboratory" | "Seminar Room" | "Computer Lab") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lecture Hall">Lecture Hall</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="Seminar Room">Seminar Room</SelectItem>
                  <SelectItem value="Computer Lab">Computer Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAccessible"
                checked={formData.isAccessible}
                onCheckedChange={(checked) => setFormData({ ...formData, isAccessible: checked === true })}
              />
              <Label htmlFor="isAccessible">Wheelchair Accessible</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities</Label>
              <div className="flex gap-2">
                <Input
                  id="facilities"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder="e.g., Projector, Whiteboard"
                />
                <Button type="button" variant="outline" onClick={addFacility}>
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {facility}
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => removeFacility(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleAddRoom}>
              Add Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Room Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-capacity">Capacity</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-building">Building</Label>
              <Select
                value={formData.building}
                onValueChange={(value) => setFormData({ ...formData, building: value })}
              >
                <SelectTrigger id="edit-building">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.name}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-floor">Floor</Label>
              <Input
                id="edit-floor"
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Room Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "Lecture Hall" | "Laboratory" | "Seminar Room" | "Computer Lab") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lecture Hall">Lecture Hall</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="Seminar Room">Seminar Room</SelectItem>
                  <SelectItem value="Computer Lab">Computer Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isAccessible"
                checked={formData.isAccessible}
                onCheckedChange={(checked) => setFormData({ ...formData, isAccessible: checked === true })}
              />
              <Label htmlFor="edit-isAccessible">Wheelchair Accessible</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-facilities">Facilities</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-facilities"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder="e.g., Projector, Whiteboard"
                />
                <Button type="button" variant="outline" onClick={addFacility}>
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {facility}
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => removeFacility(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleEditRoom}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Room Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this room? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRoom}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
