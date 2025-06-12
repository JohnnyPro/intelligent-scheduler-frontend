"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  BookOpen,
  Edit,
  FlaskConical,
  Laptop,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import useAuthStore from "@/lib/stores/auth-store";
import { useCourseStore } from "@/lib/stores/course.store";
import { useDepartmentStore } from "@/lib/stores/department.store";
import { useTeacherStore } from "@/lib/stores/teacher.store";
import { useStudentGroupStore } from "@/lib/stores/student-group.store";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete";
import { Course } from "@/lib/types/course.types";
import { SessionType } from "@/lib/types";

export default function CoursesPage() {
  // Stores
  const { courses, fetchCourses, addCourse, updateCourse, deleteCourse } =
    useCourseStore();
  const { departments, fetchDepartments } = useDepartmentStore();

  // State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sessionTypeFilter, setsessionTypeFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const initialFormData = {
    name: "",
    code: "",
    description: "",
    departmentId: null as string | null,
    ectsCredits: 0,
    sessionType: SessionType.LECTURE,
    sessionsPerWeek: 1,
  };
  const sessionTypes = Object.values(SessionType);

  const [formData, setFormData] = useState(initialFormData);

  // Fetch initial data
  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, [fetchCourses, fetchDepartments]);

  // Filter courses
  useEffect(() => {
    let filtered = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (course) => course.departmentId === departmentFilter
      );
    }
    if (sessionTypeFilter !== "all") {
      filtered = filtered.filter(
        (course) => course.sessionType === sessionTypeFilter
      );
    }

    setFilteredCourses(filtered);
  }, [searchQuery, departmentFilter, sessionTypeFilter, courses]);

  // Handlers
  const handleAddCourse = () => {
    addCourse(formData);
    setFormData(initialFormData);
    setIsAddDialogOpen(false);
  };

  const handleEditCourse = () => {
    if (selectedCourse) {
      updateCourse(selectedCourse, formData);
      setIsEditDialogOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedCourse) {
      deleteCourse(selectedCourse);
    }
  };

  const resetFormData = () => {
    setFormData(initialFormData);
    setSelectedCourse(null);
  };

  const openEditDialog = (id: string) => {
    const course = courses.find((c) => c.courseId === id);
    if (course) {
      setSelectedCourse(id);
      setFormData({
        name: course.name,
        code: course.code,
        description: course.description || "",
        departmentId: course.departmentId,
        ectsCredits: course.ectsCredits,
        sessionType: course.sessionType,
        sessionsPerWeek: course.sessionsPerWeek,
      });
      setIsEditDialogOpen(true);
    }
  };

  const openConfirmDeleteDialog = (id: string) => {
    setSelectedCourse(id);
    setIsConfirmDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout title="Courses">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
            <p className="text-muted-foreground text-sm">
              Manage course information and sessions
            </p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search courses..."
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
          <Select
            onValueChange={(val) => setsessionTypeFilter(val)}
            value={sessionTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lecture or Lab..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Session Types</SelectItem>
              {sessionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table Section */}
        <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>COURSE</TableHead>
                <TableHead>CODE</TableHead>
                <TableHead>DEPARTMENT</TableHead>
                <TableHead>SESSIONS</TableHead>
                <TableHead>CREDITS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.courseId} className="hover:bg-muted/40">
                  <TableCell className="flex items-center gap-3 font-medium">
                    <span
                      className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${
                        course.sessionType === SessionType.LECTURE
                          ? "bg-blue-100 text-blue-600"
                          : course.sessionType === SessionType.LAB
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {course.sessionType === SessionType.LECTURE ? (
                        <Laptop className="w-4 h-4" />
                      ) : course.sessionType === SessionType.LAB ? (
                        <FlaskConical className="w-4 h-4" />
                      ) : (
                        <BookOpen className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <div className="font-semibold leading-tight">
                        {course.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {course.courseId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {course.department?.name || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>{course.sessionsPerWeek}</TableCell>
                  <TableCell>{course.ectsCredits}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="edit"
                        size="icon"
                        className="hover:bg-indigo-100"
                        onClick={() => openEditDialog(course.courseId)}
                        aria-label="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="delete"
                        size="icon"
                        className="hover:bg-red-100"
                        onClick={() => openConfirmDeleteDialog(course.courseId)}
                        aria-label="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Course Dialog */}
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
              {isAddDialogOpen ? "Add New Course" : "Edit Course"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isAddDialogOpen) handleAddCourse();
              if (isEditDialogOpen) handleEditCourse();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 mt-5">
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Introduction to Computer Science"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., CS101"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Course description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.departmentId || ""}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, departmentId: value || null })
                  }
                >
                  <SelectTrigger id="department">
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
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="ectsCredits">ECTS Credits</Label>
                <Input
                  id="ectsCredits"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.ectsCredits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ectsCredits: Number(e.target.value),
                    })
                  }
                  min={0}
                />
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="sessionType">Session Type</Label>
                <Select
                  value={formData.sessionType}
                  onValueChange={(value: SessionType) =>
                    setFormData({ ...formData, sessionType: value })
                  }
                >
                  <SelectTrigger id="sessionType">
                    <SelectValue placeholder="Select session type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SessionType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex flex-col gap-3">
                <Label htmlFor="sessionsPerWeek">Sessions Per Week</Label>
                <Input
                  id="sessionsPerWeek"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.sessionsPerWeek}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sessionsPerWeek: Number(e.target.value),
                    })
                  }
                  min={1}
                />
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
                {isAddDialogOpen ? "Create Course" : "Save Changes"}
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
