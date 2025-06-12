"use client";

import { useState } from "react";
import { Department, DepartmentCreating } from "@/lib/types/department.type";
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
import { Building, Edit, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/lib/stores/auth-store";
import { useDepartmentStore } from "@/lib/stores/department.store";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete";

export default function DepartmentsPage() {
  const { isAuthenticated } = useAuthStore();

  const { departments, fetchDepartments, addDepartment, updateDepartment, deleteDepartment } =
    useDepartmentStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  
  const initialFormData = {
    name: "",
  };
  const [formData, setFormData] = useState<DepartmentCreating>(initialFormData);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleAddDepartment = () => {
    addDepartment(formData);
    setFormData(initialFormData);
    setIsAddDialogOpen(false);
  };

  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  useEffect(() => {
    const newFiltered = departments.filter((dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDepartments(newFiltered);
  }, [searchQuery, departments]);

  const handleEditDepartment = () => {
    if (selectedDepartment) {
      updateDepartment(selectedDepartment, formData);
      setIsEditDialogOpen(false);
    }
  };

  const openConfirmDeleteDialog = (id: string) => {
    setSelectedDepartment(id);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDepartment) {
      deleteDepartment(selectedDepartment);
    }
  };

  const resetFormData = () => {
    setFormData(initialFormData);
    setSelectedDepartment(null);
  };

  const openEditDialog = (id: string) => {
    const department = departments.find((d) => d.deptId === id);
    if (department) {
      setSelectedDepartment(id);
      setFormData({
        name: department.name,
      });
      setIsEditDialogOpen(true);
    }
  };

  return (
    <DashboardLayout title="Departments">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
            <p className="text-muted-foreground text-sm">Manage academic departments</p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>

        {/* Search Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search departments..."
              className="w-full pl-10 py-2 rounded-md border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DEPARTMENT</TableHead>
                <TableHead>CAMPUS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((dept) => (
                <TableRow key={dept.deptId} className="hover:bg-muted/40">
                  <TableCell className="flex items-center gap-3 font-medium">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600">
                      <Building color="currentColor" className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-semibold leading-tight">{dept.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {dept.deptId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{dept.campus?.name || 'N/A'}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="edit"
                        size="icon"
                        className="hover:bg-indigo-100"
                        onClick={() => openEditDialog(dept.deptId)}
                        aria-label="Edit"
                      >
                        <Edit color="currentColor" className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="delete"
                        size="icon"
                        className="hover:bg-red-100"
                        onClick={() => openConfirmDeleteDialog(dept.deptId)}
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

      {/* Add/Edit Department Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetFormData();
        }
      }}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? 'Add New Department' : 'Edit Department'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (isAddDialogOpen) handleAddDepartment();
              if (isEditDialogOpen) handleEditDepartment();
            }}
          >
            <div className="grid gap-4 p-4 mt-5">
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Computer Science"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
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
                {isAddDialogOpen ? 'Create Department' : 'Save Changes'}
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
