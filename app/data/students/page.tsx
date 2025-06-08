"use client"

import { useState, useMemo } from "react"
import { useStore } from "@/lib/stores/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, Plus, Search, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function StudentGroupsPage() {
  const { isAuthenticated, studentGroups, courses, addStudentGroup, updateStudentGroup, deleteStudentGroup, teachers } =
    useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStudentGroup, setSelectedStudentGroup] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    studentGroupId: "",
    name: "",
    size: 0,
    accessibilityRequirement: false,
    departmentId: "",
  })

  const router = useRouter()

  // Extract unique departments from teachers
  const departments = useMemo(() => {
    const seen = new Set()
    return teachers
      .map((t) => ({ id: t.departmentId, name: t.department.name }))
      .filter((d) => {
        if (seen.has(d.id)) return false
        seen.add(d.id)
        return true
      })
  }, [teachers])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleAddStudentGroup = () => {
    // Find department object for the selected departmentId
    const dept = departments.find((d) => d.id === formData.departmentId)
    const newGroup = {
      ...formData,
      studentGroupId: `SG${Math.floor(Math.random() * 100000)}`,
      department: dept ? { name: dept.name, campusId: "" } : { name: "", campusId: "" },
    }
    addStudentGroup(newGroup)
    setFormData({
      studentGroupId: "",
      name: "",
      size: 0,
      accessibilityRequirement: false,
      departmentId: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditStudentGroup = () => {
    if (selectedStudentGroup) {
      const dept = departments.find((d) => d.id === formData.departmentId)
      const updatedGroup = {
        ...formData,
        department: dept ? { name: dept.name, campusId: "" } : { name: "", campusId: "" },
      }
      updateStudentGroup(selectedStudentGroup, updatedGroup)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteStudentGroup = () => {
    if (selectedStudentGroup) {
      deleteStudentGroup(selectedStudentGroup)
      setIsDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (id: string) => {
    const studentGroup = studentGroups.find((sg) => sg.studentGroupId === id)
    if (studentGroup) {
      setSelectedStudentGroup(id)
      setFormData({
        studentGroupId: studentGroup.studentGroupId,
        name: studentGroup.name,
        size: studentGroup.size,
        accessibilityRequirement: studentGroup.accessibilityRequirement,
        departmentId: studentGroup.departmentId,
      })
      setIsEditDialogOpen(true)
    }
  }

  const openDeleteDialog = (id: string) => {
    setSelectedStudentGroup(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DashboardLayout title="Student Groups">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Student Groups</h2>
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
              Add Student Group
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search student groups..." className="w-full pl-8" />
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
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Accessibility</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Campus</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentGroups.map((studentGroup) => (
                <TableRow key={studentGroup.studentGroupId}>
                  <TableCell className="font-medium">{studentGroup.studentGroupId}</TableCell>
                  <TableCell>{studentGroup.name}</TableCell>
                  <TableCell>{studentGroup.size}</TableCell>
                  <TableCell>{studentGroup.accessibilityRequirement ? "Yes" : "No"}</TableCell>
                  <TableCell>{studentGroup.department.name}</TableCell>
                  <TableCell>{studentGroup.department.campusId}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(studentGroup.studentGroupId)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => openDeleteDialog(studentGroup.studentGroupId)}
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

      {/* Add Student Group Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size (Number of Students)</Label>
              <Input
                id="size"
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessibilityRequirement">Accessibility Requirement</Label>
              <input
                id="accessibilityRequirement"
                type="checkbox"
                checked={formData.accessibilityRequirement}
                onChange={(e) => setFormData({ ...formData, accessibilityRequirement: e.target.checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
              >
                <SelectTrigger id="departmentId">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddStudentGroup}>
              Add Student Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size (Number of Students)</Label>
              <Input
                id="size"
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessibilityRequirement">Accessibility Requirement</Label>
              <input
                id="accessibilityRequirement"
                type="checkbox"
                checked={formData.accessibilityRequirement}
                onChange={(e) => setFormData({ ...formData, accessibilityRequirement: e.target.checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
              >
                <SelectTrigger id="departmentId">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditStudentGroup}>
              Update Student Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Student Group Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student Group</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this student group?</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" onClick={handleDeleteStudentGroup}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
