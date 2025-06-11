"use client";

import { useState } from "react";
import { ClassroomType } from "@/lib/types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Filter, Plus, Search, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/lib/stores/auth-store";
import { useClassroomStore } from "@/lib/stores/classroom.store";
import { useBuildingStore } from "@/lib/stores/building.store";

export default function RoomsPage() {
  const { isAuthenticated } = useAuthStore();

  const { classrooms, fetchClassrooms, addClassroom, updateClassroom, deleteClassroom } =
    useClassroomStore();
  const { buildings } = useBuildingStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    buildingId: null as string | null,
    floor: 1,
    type: ClassroomType.LECTURE,
    isWheelchairAccessible: false,
    openingTime: null as string | null,
    closingTime: null as string | null,
  });

  const router = useRouter();
  const classroomTypes = Object.values(ClassroomType); // ["LECTURE", "LAB", "SEMINAR"]

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }
  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms])

  const handleAddRoom = () => {
    addClassroom(formData);
    setFormData({
      name: "",
      capacity: 0,
      buildingId: null,
      floor: 1,
      type: ClassroomType.LECTURE,
      isWheelchairAccessible: false,
      openingTime: null,
      closingTime: null,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditRoom = () => {
    if (selectedRoom) {
      updateClassroom(selectedRoom, formData);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteRoom = () => {
    if (selectedRoom) {
      deleteClassroom(selectedRoom);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (id: string) => {
    const room = classrooms.find((r) => r.classroomId === id);
    if (room) {
      setSelectedRoom(id);
      setFormData({
        name: room.name,
        capacity: room.capacity,
        buildingId: room.buildingId,
        floor: room.floor,
        type: room.type,
        isWheelchairAccessible: room.isWheelchairAccessible,
        openingTime: room.openingTime,
        closingTime: room.closingTime,
      });
      setIsEditDialogOpen(true);
    }
  };

  const openDeleteDialog = (id: string) => {
    setSelectedRoom(id);
    setIsDeleteDialogOpen(true);
  };

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
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search classrooms..."
              className="w-full pl-8"
            />
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
              {classrooms.map((room) => (
                <TableRow key={room.classroomId}>
                  <TableCell className="font-medium">
                    {room.classroomId}
                  </TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.building?.name || "N/A"}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>
                    {room.isWheelchairAccessible ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(room.classroomId)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => openDeleteDialog(room.classroomId)}
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: Number.parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Select
                value={formData.buildingId || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, buildingId: value || null })
                }
              >
                <SelectTrigger id="building">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem
                      key={building.buildingId}
                      value={building.buildingId}
                    >
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    floor: Number.parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Room Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ClassroomType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {classroomTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isWheelchairAccessible"
                checked={formData.isWheelchairAccessible}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    isWheelchairAccessible: checked === true,
                  })
                }
              />
              <Label htmlFor="isWheelchairAccessible">
                Wheelchair Accessible
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="openingTime">Opening Time</Label>
              <Input
                id="openingTime"
                type="time"
                value={formData.openingTime || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    openingTime: e.target.value || null,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closingTime">Closing Time</Label>
              <Input
                id="closingTime"
                type="time"
                value={formData.closingTime || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    closingTime: e.target.value || null,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleAddRoom}
            >
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-capacity">Capacity</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: Number.parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-building">Building</Label>
              <Select
                value={formData.buildingId || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, buildingId: value || null })
                }
              >
                <SelectTrigger id="edit-building">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem
                      key={building.buildingId}
                      value={building.buildingId}
                    >
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    floor: Number.parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Room Type</Label>
              <Select
                value={formData.type}
                onValueChange={(
                  value: ClassroomType
                ) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {classroomTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isWheelchairAccessible"
                checked={formData.isWheelchairAccessible}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    isWheelchairAccessible: checked === true,
                  })
                }
              />
              <Label htmlFor="edit-isWheelchairAccessible">
                Wheelchair Accessible
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-openingTime">Opening Time</Label>
              <Input
                id="edit-openingTime"
                type="time"
                value={formData.openingTime || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    openingTime: e.target.value || null,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-closingTime">Closing Time</Label>
              <Input
                id="edit-closingTime"
                type="time"
                value={formData.closingTime || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    closingTime: e.target.value || null,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleEditRoom}
            >
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
            <p>
              Are you sure you want to delete this room? This action cannot be
              undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRoom}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
