"use client"

import { useState } from "react"
import { useStore } from "@/lib/stores/store"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Filter, Plus, Search, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import useAuthStore from "@/lib/stores/auth-store"

export default function BuildingsPage() {
  const { isAuthenticated } = useAuthStore()
  const { buildings, addBuilding, updateBuilding, deleteBuilding } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    floors: 1,
    rooms: 0,
    isAccessible: false,
  })

  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleAddBuilding = () => {
    addBuilding(formData)
    setFormData({
      name: "",
      address: "",
      floors: 1,
      rooms: 0,
      isAccessible: false,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditBuilding = () => {
    if (selectedBuilding) {
      updateBuilding(selectedBuilding, formData)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteBuilding = () => {
    if (selectedBuilding) {
      deleteBuilding(selectedBuilding)
      setIsDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (id: string) => {
    const building = buildings.find((b) => b.id === id)
    if (building) {
      setSelectedBuilding(id)
      setFormData({
        name: building.name,
        address: building.address,
        floors: building.floors,
        rooms: building.rooms,
        isAccessible: building.isAccessible,
      })
      setIsEditDialogOpen(true)
    }
  }

  const openDeleteDialog = (id: string) => {
    setSelectedBuilding(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DashboardLayout title="Buildings & Campuses">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Buildings & Campuses</h2>
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
              Add Building
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search buildings..." className="w-full pl-8" />
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
                <TableHead>ADDRESS</TableHead>
                <TableHead>FLOORS</TableHead>
                <TableHead>ROOMS</TableHead>
                <TableHead>ACCESSIBILITY</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildings.map((building) => (
                <TableRow key={building.id}>
                  <TableCell className="font-medium">{building.id}</TableCell>
                  <TableCell>{building.name}</TableCell>
                  <TableCell>{building.address}</TableCell>
                  <TableCell>{building.floors}</TableCell>
                  <TableCell>{building.rooms}</TableCell>
                  <TableCell>{building.isAccessible ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(building.id)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => openDeleteDialog(building.id)}
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

      {/* Add Building Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Building</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Building Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floors">Number of Floors</Label>
              <Input
                id="floors"
                type="number"
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">Number of Rooms</Label>
              <Input
                id="rooms"
                type="number"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAccessible"
                checked={formData.isAccessible}
                onCheckedChange={(checked) => setFormData({ ...formData, isAccessible: checked === true })}
              />
              <Label htmlFor="isAccessible">Wheelchair Accessible</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleAddBuilding}>
              Add Building
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Building Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Building</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Building Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-floors">Number of Floors</Label>
              <Input
                id="edit-floors"
                type="number"
                value={formData.floors}
                onChange={(e) => setFormData({ ...formData, floors: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rooms">Number of Rooms</Label>
              <Input
                id="edit-rooms"
                type="number"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isAccessible"
                checked={formData.isAccessible}
                onCheckedChange={(checked) => setFormData({ ...formData, isAccessible: checked === true })}
              />
              <Label htmlFor="edit-isAccessible">Wheelchair Accessible</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleEditBuilding}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Building Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Building</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this building? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBuilding}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
