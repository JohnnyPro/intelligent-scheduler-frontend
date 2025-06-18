"use client";

import { useState } from "react";
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
  User,
  Mail,
  GraduationCap,
  Plus,
  Search,
  BookOpen,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import { useTeacherStore } from "@/lib/stores/teacher.store";
import { useDepartmentStore } from "@/lib/stores/department.store";
import { useCourseStore } from "@/lib/stores/course.store";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete";
import PaginationControls from "@/components/ui/pagination-control";

export default function TeachersPage() {
  const {
    teachers,
    pagination,
    fetchTeachers,
    assignTeacher,
    unassignTeacher,
  } = useTeacherStore();
  const { departments, fetchDepartments } = useDepartmentStore();
  const { courses, fetchCourses } = useCourseStore();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isViewCoursesDialogOpen, setIsViewCoursesDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [coursesToUnassign, setCoursesToUnassign] = useState<string[]>([]);

  const [filteredTeachers, setFilteredTeachers] = useState(teachers);
  useEffect(() => {
    let newFiltered = teachers.filter(
      (teacher) =>
        `${teacher.user.firstName} ${teacher.user.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        (departmentFilter === "all" ||
          teacher.department.deptId === departmentFilter)
    );
    setFilteredTeachers(newFiltered);
  }, [searchQuery, departmentFilter, teachers]);

  useEffect(() => {
    fetchDepartments();
    fetchTeachers();
    fetchCourses();
  }, [fetchDepartments, fetchTeachers, fetchCourses]);

  const handleAssignCourse = () => {
    if (selectedTeacher && selectedCourseId) {
      assignTeacher(selectedTeacher, {
        teacherId: selectedTeacher,
        courseId: selectedCourseId,
      });
      setSelectedCourseId("");
      // Don't close the modal, let user assign more courses
    }
  };

  const handleUnassignCourses = () => {
    if (selectedTeacher && coursesToUnassign.length > 0) {
      unassignTeacher(selectedTeacher, coursesToUnassign);
      setCoursesToUnassign([]);
      setIsViewCoursesDialogOpen(false);
    }
  };

  const toggleCourseUnassign = (courseId: string) => {
    setCoursesToUnassign(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const openAssignDialog = (id: string) => {
    setSelectedTeacher(id);
    setIsAssignDialogOpen(true);
  };

  const openViewCoursesDialog = (id: string) => {
    setSelectedTeacher(id);
    setCoursesToUnassign([]);
    setIsViewCoursesDialogOpen(true);
  };

  const selectedTeacherData = teachers.find((t) => t.teacherId === selectedTeacher);

  return (
    <DashboardLayout title="Teachers">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
            <p className="text-muted-foreground text-sm">
              Manage teacher course assignments
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search teachers..."
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
                fetchTeachers(newPage, newSize)
              }
            />
          )}
        </div>

        {/* Table Section */}
        <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TEACHER</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>DEPARTMENT</TableHead>
                <TableHead>ASSIGNED COURSES</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.teacherId} className="hover:bg-muted/40">
                  <TableCell className="flex items-center gap-3 font-medium">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600">
                      <User color="currentColor" className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-semibold leading-tight">
                        {teacher.user.firstName} {teacher.user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {teacher.teacherId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{teacher.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{teacher.department.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {teacher.courses.length} course{teacher.courses.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-green-50 border-green-200 text-green-700"
                        onClick={() => openAssignDialog(teacher.teacherId)}
                        aria-label="Assign Course"
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 border-blue-200 text-blue-700"
                        onClick={() => openViewCoursesDialog(teacher.teacherId)}
                        aria-label="View Courses"
                      >
                        <GraduationCap className="w-4 h-4 mr-1" />
                        Courses
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Assign Course Dialog */}
      <Dialog
        open={isAssignDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAssignDialogOpen(false);
            setSelectedCourseId("");
          }
        }}
      >
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Assign Course to {selectedTeacherData?.user.firstName} {selectedTeacherData?.user.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4">
              <Label htmlFor="course" className="text-sm font-medium text-gray-700">
                Select Course to Assign
              </Label>
              <Select
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
              >
                <SelectTrigger id="course" className="w-full">
                  <SelectValue placeholder="Choose a course to assign..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.filter(x => selectedTeacherData?.courses.findIndex(y => y.courseId === x.courseId) === -1).map((course) => (
                    <SelectItem key={course.courseId} value={course.courseId}>
                      <div className="flex flex-col">
                        <span className="font-medium">{course.code} - {course.name}</span>
                        <span className="text-xs text-gray-500">
                          {course.ectsCredits} ECTS • {course.sessionsPerWeek} sessions/week
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4 justify-end">
              <Button
                onClick={handleAssignCourse}
                disabled={!selectedCourseId}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Assign Course
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAssignDialogOpen(false)}
                className="px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Assigned Courses Dialog */}
      <Dialog
        open={isViewCoursesDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsViewCoursesDialogOpen(false);
            setCoursesToUnassign([]);
          }
        }}
      >
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Assigned Courses - {selectedTeacherData?.user.firstName} {selectedTeacherData?.user.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {selectedTeacherData?.courses && selectedTeacherData.courses.length > 0 ? (
              <div className="space-y-3">
                {selectedTeacherData.courses.map((course) => (
                  <div
                    key={course.courseId}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${coursesToUnassign.includes(course.courseId)
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={coursesToUnassign.includes(course.courseId)}
                        onChange={() => toggleCourseUnassign(course.courseId)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{course.code} - {course.name}</div>
                        <div className="text-sm text-gray-600">
                          {course.ectsCredits} ECTS • {course.sessionsPerWeek} sessions/week
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No courses assigned yet</p>
                <p className="text-sm">Use the Assign button to add courses</p>
              </div>
            )}
          </div>
          <DialogFooter className="px-6 pb-6">
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => setIsViewCoursesDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUnassignCourses}
                disabled={coursesToUnassign.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white font-medium flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Unassign Selected ({coursesToUnassign.length})
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
