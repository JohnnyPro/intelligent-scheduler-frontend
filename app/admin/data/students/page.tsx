"use client";

import { useState, useEffect } from "react";
import { StudentGroup } from "@/lib/types/student-group.types";
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
import { Users, Edit, Plus, Search, Trash2 } from "lucide-react";
import { useStudentGroupStore } from "@/lib/stores/student-group.store";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete";
import { useDepartmentStore } from "@/lib/stores/department.store";
import PaginationControls from "@/components/ui/pagination-control";

export default function StudentGroupsPage() {
  const {
    studentGroups,
    pagination,
    fetchStudentGroups,
    addStudentGroup,
    updateStudentGroup,
    deleteStudentGroup,
  } = useStudentGroupStore();
  const { departments, fetchDepartments } = useDepartmentStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedStudentGroup, setSelectedStudentGroup] = useState<
    string | null
  >(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const initialFormData = {
    name: "",
    size: 0,
    departmentId: "",
    accessibilityRequirement: false,
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchStudentGroups();
    fetchDepartments();
  }, [fetchStudentGroups, fetchDepartments]);

  const [filteredStudentGroups, setFilteredStudentGroups] = useState<
    StudentGroup[]
  >([]);
  useEffect(() => {
    const newFiltered = studentGroups.filter(
      (group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (departmentFilter === "all" || group.departmentId === departmentFilter)
    );
    setFilteredStudentGroups(newFiltered);
  }, [searchQuery, studentGroups]);

  const handleAddStudentGroup = () => {
    addStudentGroup(formData);
    setFormData(initialFormData);
    setIsAddDialogOpen(false);
  };

  const handleEditStudentGroup = () => {
    if (selectedStudentGroup) {
      updateStudentGroup(selectedStudentGroup, formData);
      setIsEditDialogOpen(false);
    }
  };

  const openConfirmDeleteDialog = (id: string) => {
    setSelectedStudentGroup(id);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStudentGroup) {
      deleteStudentGroup(selectedStudentGroup);
    }
  };

  const resetFormData = () => {
    setFormData(initialFormData);
    setSelectedStudentGroup(null);
  };

  const openEditDialog = (id: string) => {
    const group = studentGroups.find((g) => g.studentGroupId === id);
    if (group) {
      setSelectedStudentGroup(id);
      setFormData({
        name: group.name,
        size: group.size,
        departmentId: group.departmentId,
        accessibilityRequirement: group.accessibilityRequirement,
      });
      setIsEditDialogOpen(true);
    }
  };

  return (
    <DashboardLayout title="Student Groups">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Student Groups
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage student groups and their requirements
            </p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Group
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search student groups..."
              className="w-full pl-10 py-2 rounded-md border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            onValueChange={(val) => setDepartmentFilter(val)}
            value={departmentFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.deptId} value={dept.deptId}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {pagination && (
            <PaginationControls
              pagination={pagination}
              onPaginationChange={(newPage: number, newSize: number) =>
                fetchStudentGroups(newPage, newSize)
              }
            />
          )}
        </div>

        {/* Table Section */}
        <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GROUP</TableHead>
                <TableHead>SIZE</TableHead>
                <TableHead>DEPARTMENT</TableHead>
                <TableHead>ACCESSIBILITY</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudentGroups.map((group) => (
                <TableRow
                  key={group.studentGroupId}
                  className="hover:bg-muted/40"
                >
                  <TableCell className="flex items-center gap-3 font-medium">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600">
                      <Users color="currentColor" className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-semibold leading-tight">
                        {group.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {group.studentGroupId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{group.size}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {group.department?.name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {group.accessibilityRequirement ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                        Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-medium">
                        Not Required
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="edit"
                        size="icon"
                        className="hover:bg-indigo-100"
                        onClick={() => openEditDialog(group.studentGroupId)}
                        aria-label="Edit"
                      >
                        <Edit color="currentColor" className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="delete"
                        size="icon"
                        className="hover:bg-red-100"
                        onClick={() =>
                          openConfirmDeleteDialog(group.studentGroupId)
                        }
                        aria-label="Delete"
                      >
                        <Trash2
                          color="currentColor"
                          strokeWidth={2}
                          className="w-5 h-5"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Group Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            resetFormData();
          }
        }}
      >
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Add New Student Group" : "Edit Student Group"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isAddDialogOpen) handleAddStudentGroup();
              if (isEditDialogOpen) handleEditStudentGroup();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 mt-5">
              <div className="space-y-2 flex flex-col gap-3 col-span-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Computer Science 101"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="size">Number of Students</Label>
                <Input
                  id="size"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      size: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="departmentId">Department</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departmentId: value })
                  }
                  required
                >
                  <SelectTrigger id="departmentId">
                    <SelectValue placeholder="Select department..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.deptId} value={dept.deptId}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 md:col-span-2 pt-2">
                <Checkbox
                  id="accessibilityRequirement"
                  checked={formData.accessibilityRequirement}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      accessibilityRequirement: checked === true,
                    })
                  }
                />
                <Label
                  htmlFor="accessibilityRequirement"
                  className="text-sm font-medium"
                >
                  Accessibility Requirements
                </Label>
              </div>
            </div>
            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isAddDialogOpen ? "Create Group" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={isConfirmDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onOpenChange={setIsConfirmDeleteDialogOpen}
      />
    </DashboardLayout>
  );
}
