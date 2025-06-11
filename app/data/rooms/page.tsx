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
import { Accessibility, Edit, FlaskConical, Laptop, Mic, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/lib/stores/auth-store";
import { useClassroomStore } from "@/lib/stores/classroom.store";
import { useBuildingStore } from "@/lib/stores/building.store";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete";
import { Classroom } from "@/lib/types/classroom.types";

export default function RoomsPage() {
  const { isAuthenticated } = useAuthStore();

  const { classrooms, fetchClassrooms, addClassroom, updateClassroom, deleteClassroom } =
    useClassroomStore();
  const { buildings, fetchBuildings } = useBuildingStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clasroomTypeFilter, setClassroomTypeFilter] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const initialFormData = {
    name: "",
    capacity: 0,
    buildingId: null as string | null,
    floor: 1,
    type: ClassroomType.LECTURE,
    isWheelchairAccessible: false,
    openingTime: null as string | null,
    closingTime: null as string | null,
  };
  const [formData, setFormData] = useState(initialFormData);

  const router = useRouter();
  const classroomTypes = Object.values(ClassroomType);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }
  useEffect(() => {
    fetchBuildings();
    fetchClassrooms();
  }, [fetchBuildings, fetchClassrooms])

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
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  useEffect(() => {
    let newFiltered = classrooms.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
      && (clasroomTypeFilter == 'all' || room.type == clasroomTypeFilter)
    );
    setFilteredClassrooms(newFiltered);
  }, [searchQuery, clasroomTypeFilter, classrooms])

  const handleEditRoom = () => {
    if (selectedRoom) {
      updateClassroom(selectedRoom, formData);
      setIsEditDialogOpen(false);
    }
  };

  const openConfirmDeleteDialog = (id: string) => {
    setSelectedRoom(id);
    setIsConfirmDeleteDialogOpen(true); // Open the new confirmation dialog
  };

  const handleConfirmDelete = () => {
    if (selectedRoom) {
      deleteClassroom(selectedRoom);
    }
  };


  const resetFormData = () => {
    setFormData(initialFormData);
    setSelectedRoom(null);
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

  return (
    <DashboardLayout title="Classrooms">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
            <p className="text-muted-foreground text-sm">Manage classroom availability and settings</p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Classroom
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search classrooms..."
              className="w-full pl-10 py-2 rounded-md border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select onValueChange={(val) => setClassroomTypeFilter(val)} value={clasroomTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {classroomTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table Section */}
        <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CLASSROOM</TableHead>
                <TableHead>TYPE</TableHead>
                <TableHead>CAPACITY</TableHead>
                <TableHead>LOCATION</TableHead>
                <TableHead>HOURS</TableHead>
                <TableHead>ACCESSIBILITY</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClassrooms.map((room) => (
                <TableRow key={room.classroomId} className="hover:bg-muted/40">
                  <TableCell className="flex items-center gap-3 font-medium">
                    {room.type === ClassroomType.LECTURE ? (
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600">
                        <Laptop color="currentColor" className="w-4 h-4" />
                      </span>
                    ) : room.type === ClassroomType.LAB ? (
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-green-100 text-green-600">
                        <FlaskConical color="currentColor" className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-purple-100 text-purple-600">
                        <Mic color="currentColor" className="w-4 h-4" />
                      </span>
                    )}
                    <div>
                      <div className="font-semibold leading-tight">{room.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {room.classroomId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${room.type === ClassroomType.LECTURE ? 'bg-blue-100 text-blue-700' : room.type === ClassroomType.LAB ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{room.type === ClassroomType.LECTURE ? 'Lecture Hall' : room.type === ClassroomType.LAB ? 'Laboratory' : 'Seminar'}</span>
                  </TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>
                    <div className="font-medium">{room.building?.name || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">{room.building?.name ? `Building ${room.building.name.split(' ')[1]}, Floor ${room.floor}` : ''}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">{room.openingTime && room.closingTime ? `${room.openingTime} - ${room.closingTime}` : 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    {room.isWheelchairAccessible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                        <Accessibility color="currentColor" className="w-4 h-4" strokeWidth={2} />
                        Accessible</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-medium">Not Accessible</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="edit"
                        size="icon"
                        className="hover:bg-indigo-100"
                        onClick={() => openEditDialog(room.classroomId)}
                        aria-label="Edit"
                      >
                        <Edit color="currentColor" className="w-5 h-5" />
                        {/* <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11-11a2.828 2.828 0 00-4-4L5 17v4z" /></svg> */}
                      </Button>
                      <Button
                        variant="delete"
                        size="icon"
                        className="hover:bg-red-100"
                        onClick={() => openConfirmDeleteDialog(room.classroomId)}
                        aria-label="Delete"
                      >
                        <Trash2 color="currentColor" strokeWidth={2} className="w-5 h-5" />

                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Room Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetFormData();
        }
      }}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? 'Add New Classroom' : 'Edit Classroom'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (isAddDialogOpen) handleAddRoom();
              if (isEditDialogOpen) handleEditRoom();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 mt-5">
              <div className="space-y-2 flex flex-col gap-3 col-span-2">
                <Label htmlFor="name">Classroom Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Room A-101"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 0 })}
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="building">Building</Label>
                <Select
                  value={formData.buildingId || ''}
                  onValueChange={value => setFormData({ ...formData, buildingId: value || null })}
                  required
                >
                  <SelectTrigger id="building">
                    <SelectValue placeholder="Select building..." />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map(building => (
                      <SelectItem key={building.buildingId} value={building.buildingId}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  type="number"
                  placeholder="e.g., 1"
                  value={formData.floor}
                  onChange={e => setFormData({ ...formData, floor: Number.parseInt(e.target.value) || 1 })}
                  min={1}
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={value => setFormData({ ...formData, type: value as ClassroomType })}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classroomTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="openingTime">Opening Time</Label>
                <Input
                  id="openingTime"
                  type="time"
                  value={formData.openingTime || ''}
                  onChange={e => setFormData({ ...formData, openingTime: e.target.value || null })}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="closingTime">Closing Time</Label>
                <Input
                  id="closingTime"
                  type="time"
                  value={formData.closingTime || ''}
                  onChange={e => setFormData({ ...formData, closingTime: e.target.value || null })}
                  required
                />
              </div>
              <div className="flex items-center gap-2 md:col-span-2 pt-2">
                <Checkbox
                  id="isWheelchairAccessible"
                  checked={formData.isWheelchairAccessible}
                  onCheckedChange={checked => setFormData({ ...formData, isWheelchairAccessible: checked === true })}
                />
                <Label htmlFor="isWheelchairAccessible" className="text-sm font-medium">Wheelchair Accessible</Label>
              </div>
            </div>
            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                {isAddDialogOpen ? 'Create Classroom' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      <ConfirmDeleteDialog
        open={isConfirmDeleteDialogOpen}
        onConfirm={handleConfirmDelete} // Call this when user confirms
        onOpenChange={setIsConfirmDeleteDialogOpen} // This handles closing the dialog
      />
    </DashboardLayout>
  );
}
