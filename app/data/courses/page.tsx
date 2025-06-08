import type { Metadata } from "next"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Filter, Plus, Search, Upload } from "lucide-react"

export const metadata: Metadata = {
  title: "Courses & Sessions | Intelligent Scheduling System",
  description: "Manage courses and sessions in the Intelligent Scheduling System",
}

// Mock courses data
const courses = [
  {
    id: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    sessions: 3,
    teacher: "John Smith",
    studentGroups: ["CS-Y1", "CS-Y2"],
  },
  {
    id: "MATH201",
    name: "Calculus II",
    department: "Mathematics",
    sessions: 2,
    teacher: "Sarah Johnson",
    studentGroups: ["MATH-Y2", "ENG-Y2"],
  },
  {
    id: "ENG105",
    name: "Technical Writing",
    department: "English",
    sessions: 1,
    teacher: "Michael Brown",
    studentGroups: ["CS-Y1", "ENG-Y1"],
  },
  {
    id: "PHYS202",
    name: "Electricity and Magnetism",
    department: "Physics",
    sessions: 4,
    teacher: "Emily Davis",
    studentGroups: ["PHYS-Y2", "ENG-Y2"],
  },
  {
    id: "BIO101",
    name: "Introduction to Biology",
    department: "Biology",
    sessions: 3,
    teacher: "Robert Wilson",
    studentGroups: ["BIO-Y1", "CHEM-Y1"],
  },
]

export default function CoursesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Courses & Sessions" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Courses & Sessions</h2>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search courses..." className="w-full pl-8" />
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
                    <TableHead>COURSE ID</TableHead>
                    <TableHead>NAME</TableHead>
                    <TableHead>DEPARTMENT</TableHead>
                    <TableHead>SESSIONS</TableHead>
                    <TableHead>TEACHER</TableHead>
                    <TableHead>STUDENT GROUPS</TableHead>
                    <TableHead className="text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.id}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.department}</TableCell>
                      <TableCell>{course.sessions}</TableCell>
                      <TableCell>{course.teacher}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {course.studentGroups.map((group) => (
                            <span
                              key={group}
                              className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium"
                            >
                              {group}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
        </main>
      </div>
    </div>
  )
}
