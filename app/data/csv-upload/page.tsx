"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/stores/store"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  FileText,
  Clock,
  RefreshCw,
  ChevronRight,
  Home,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import useAuthStore from "@/lib/stores/auth-store"

type UploadStatus = "pending" | "uploading" | "validating" | "success" | "error"

type ValidationError = {
  row: number
  column: string
  message: string
  severity: "error" | "warning"
}

type UploadResult = {
  status: UploadStatus
  file?: File
  totalRows: number
  validRows: number
  invalidRows: number
  errors: ValidationError[]
  uploadedAt?: Date
}

type DataType = {
  id: string
  name: string
  description: string
  dependencies: string[]
  sampleData: string[][]
  required: boolean
}

const dataTypes: DataType[] = [
  {
    id: "departments",
    name: "Departments",
    description: "Academic departments and their information",
    dependencies: [],
    required: true,
    sampleData: [
      ["Department ID", "Name", "Head", "Building"],
      ["DEPT001", "Computer Science", "Dr. John Smith", "Engineering Building"],
      ["DEPT002", "Mathematics", "Dr. Sarah Johnson", "Science Building"],
    ],
  },
  {
    id: "courses",
    name: "Courses",
    description: "Course information and curriculum data",
    dependencies: ["departments"],
    required: true,
    sampleData: [
      ["Course ID", "Name", "Department ID", "Credits", "Sessions Per Week"],
      ["CS101", "Introduction to Programming", "DEPT001", "3", "2"],
      ["MATH201", "Calculus II", "DEPT002", "4", "3"],
    ],
  },
  {
    id: "teachers",
    name: "Teachers",
    description: "Faculty and instructor information",
    dependencies: ["departments"],
    required: true,
    sampleData: [
      ["Teacher ID", "Name", "Email", "Department ID", "Specialization", "Accessible"],
      ["T001", "Dr. Alice Brown", "alice.brown@university.edu", "DEPT001", "AI/ML", "false"],
      ["T002", "Prof. Bob Wilson", "bob.wilson@university.edu", "DEPT002", "Statistics", "true"],
    ],
  },
  {
    id: "rooms",
    name: "Rooms",
    description: "Classroom and facility information",
    dependencies: [],
    required: true,
    sampleData: [
      ["Room ID", "Name", "Building", "Floor", "Capacity", "Type", "Accessible"],
      ["R001", "NB101", "Engineering Building", "1", "50", "Lecture Hall", "true"],
      ["R002", "SB205", "Science Building", "2", "30", "Laboratory", "false"],
    ],
  },
  {
    id: "student-groups",
    name: "Student Groups",
    description: "Class sections and student cohorts",
    dependencies: ["departments"],
    required: true,
    sampleData: [
      ["Group ID", "Name", "Department ID", "Year", "Size"],
      ["SG001", "CS-Y1-A", "DEPT001", "1", "45"],
      ["SG002", "MATH-Y2-B", "DEPT002", "2", "38"],
    ],
  },
  {
    id: "students",
    name: "Students",
    description: "Individual student records",
    dependencies: ["student-groups"],
    required: false,
    sampleData: [
      ["Student ID", "Name", "Email", "Group ID", "Year"],
      ["S001", "John Doe", "john.doe@student.university.edu", "SG001", "1"],
      ["S002", "Jane Smith", "jane.smith@student.university.edu", "SG001", "1"],
    ],
  },
  {
    id: "student-group-courses",
    name: "Student Group Courses",
    description: "Links between student groups and their courses",
    dependencies: ["courses", "student-groups"],
    required: true,
    sampleData: [
      ["Group ID", "Course ID", "Semester"],
      ["SG001", "CS101", "Fall 2025"],
      ["SG001", "MATH201", "Fall 2025"],
    ],
  },
]

export default function CSVUploadPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [uploadResults, setUploadResults] = useState<Record<string, UploadResult>>({})
  const [activeTab, setActiveTab] = useState("upload")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const getUploadStatus = (dataTypeId: string): UploadStatus => {
    return uploadResults[dataTypeId]?.status || "pending"
  }

  const canUpload = (dataType: DataType): boolean => {
    return dataType.dependencies.every((dep) => getUploadStatus(dep) === "success")
  }

  const handleFileUpload = async (dataTypeId: string, file: File) => {
    setUploadResults((prev) => ({
      ...prev,
      [dataTypeId]: {
        status: "uploading",
        file,
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        errors: [],
      },
    }))

    // Simulate file processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate validation
    setUploadResults((prev) => ({
      ...prev,
      [dataTypeId]: {
        ...prev[dataTypeId]!,
        status: "validating",
      },
    }))

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock validation results
    const mockResults = generateMockValidationResults(file)

    setUploadResults((prev) => ({
      ...prev,
      [dataTypeId]: {
        status: mockResults.errors.filter((e) => e.severity === "error").length > 0 ? "error" : "success",
        file,
        totalRows: mockResults.totalRows,
        validRows: mockResults.validRows,
        invalidRows: mockResults.invalidRows,
        errors: mockResults.errors,
        uploadedAt: new Date(),
      },
    }))
  }

  const generateMockValidationResults = (file: File) => {
    const totalRows = Math.floor(Math.random() * 100) + 50
    const errorCount = Math.floor(Math.random() * 8) // Increased potential errors
    const warningCount = Math.floor(Math.random() * 5)

    const errors: ValidationError[] = []

    // More realistic error scenarios based on data type
    const commonErrors = [
      "Required field is empty",
      "Invalid email format",
      "Referenced ID does not exist in dependencies",
      "Duplicate ID found",
      "Value exceeds maximum limit",
      "Invalid date format",
      "Capacity must be a positive integer",
      "Department code not found",
      "Teacher ID already assigned to another department",
      "Room capacity insufficient for student group size",
    ]

    const commonWarnings = [
      "Optional field is empty",
      "Unusual capacity value detected",
      "Email domain not recognized",
      "Room name format recommendation not followed",
      "Student group size seems unusually large",
      "Course credit hours outside typical range",
    ]

    // Generate mock errors
    for (let i = 0; i < errorCount; i++) {
      errors.push({
        row: Math.floor(Math.random() * totalRows) + 2,
        column: ["Name", "Email", "Department ID", "Capacity", "Course ID", "Teacher ID"][
          Math.floor(Math.random() * 6)
        ],
        message: commonErrors[Math.floor(Math.random() * commonErrors.length)],
        severity: "error",
      })
    }

    // Generate mock warnings
    for (let i = 0; i < warningCount; i++) {
      errors.push({
        row: Math.floor(Math.random() * totalRows) + 2,
        column: ["Phone", "Address", "Notes", "Building", "Floor"][Math.floor(Math.random() * 5)],
        message: commonWarnings[Math.floor(Math.random() * commonWarnings.length)],
        severity: "warning",
      })
    }

    return {
      totalRows,
      validRows: totalRows - errorCount,
      invalidRows: errorCount,
      errors,
    }
  }

  const downloadTemplate = (dataType: DataType) => {
    const csvContent = dataType.sampleData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${dataType.id}-template.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetUpload = (dataTypeId: string) => {
    setUploadResults((prev) => {
      const newResults = { ...prev }
      delete newResults[dataTypeId]
      return newResults
    })
  }

  const resetAllUploads = () => {
    setUploadResults({})
  }

  const getOverallProgress = () => {
    const requiredTypes = dataTypes.filter((dt) => dt.required)
    const completedRequired = requiredTypes.filter((dt) => getUploadStatus(dt.id) === "success").length
    return (completedRequired / requiredTypes.length) * 100
  }

  const StatusIcon = ({ status }: { status: UploadStatus }) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "uploading":
      case "validating":
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <DashboardLayout title="CSV Data Upload">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">CSV Data Upload</h2>
            <p className="text-gray-500">Upload your institutional data using CSV files</p>
          </div>
          <Button variant="outline" onClick={resetAllUploads}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset All
          </Button>
        </div>

        {/* Add this after the main header div */}
        <nav className="flex items-center space-x-1 text-sm text-gray-500">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <span>Data Management</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">CSV Upload</span>
        </nav>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Required uploads completed</span>
                <span>{Math.round(getOverallProgress())}%</span>
              </div>
              <Progress value={getOverallProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="validation">Validation Results</TabsTrigger>
            <TabsTrigger value="templates">Download Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Upload Order:</strong> Files must be uploaded in dependency order. Departments →
                Courses/Teachers/Student Groups → Students/Student Group Courses
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {dataTypes.map((dataType) => {
                const status = getUploadStatus(dataType.id)
                const canUploadFile = canUpload(dataType)
                const result = uploadResults[dataType.id]

                return (
                  <Card
                    key={dataType.id}
                    className={cn(
                      "transition-all",
                      status === "success" && "border-emerald-200 bg-emerald-50",
                      status === "error" && "border-red-200 bg-red-50",
                      !canUploadFile && status === "pending" && "opacity-60",
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StatusIcon status={status} />
                          <div>
                            <CardTitle className="text-lg">
                              {dataType.name}
                              {dataType.required && <span className="text-red-500 ml-1">*</span>}
                            </CardTitle>
                            <p className="text-sm text-gray-500">{dataType.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {status === "success" && (
                            <Button variant="outline" size="sm" onClick={() => resetUpload(dataType.id)}>
                              Reset
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => downloadTemplate(dataType)}>
                            <Download className="mr-2 h-4 w-4" />
                            Template
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {dataType.dependencies.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Dependencies:</p>
                          <div className="flex flex-wrap gap-2">
                            {dataType.dependencies.map((dep) => {
                              const depType = dataTypes.find((dt) => dt.id === dep)
                              const depStatus = getUploadStatus(dep)
                              return (
                                <span
                                  key={dep}
                                  className={cn(
                                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                    depStatus === "success" && "bg-emerald-100 text-emerald-700",
                                    depStatus !== "success" && "bg-gray-100 text-gray-600",
                                  )}
                                >
                                  {depStatus === "success" ? (
                                    <CheckCircle className="h-3 w-3" />
                                  ) : (
                                    <Clock className="h-3 w-3" />
                                  )}
                                  {depType?.name}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {status === "pending" && (
                        <div>
                          <Label htmlFor={`file-${dataType.id}`} className="text-sm font-medium">
                            Choose CSV file
                          </Label>
                          <Input
                            id={`file-${dataType.id}`}
                            type="file"
                            accept=".csv"
                            disabled={!canUploadFile}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(dataType.id, file)
                              }
                            }}
                            className="mt-1"
                          />
                          {!canUploadFile && <p className="text-xs text-gray-500 mt-1">Complete dependencies first</p>}
                        </div>
                      )}

                      {(status === "uploading" || status === "validating") && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span className="text-sm">
                              {status === "uploading" ? "Uploading file..." : "Validating data..."}
                            </span>
                          </div>
                          <Progress value={status === "uploading" ? 30 : 70} className="h-2" />
                        </div>
                      )}

                      {result && (status === "success" || status === "error") && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">{result.file?.name}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Total Rows:</span>
                              <div className="font-medium">{result.totalRows}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Valid:</span>
                              <div className="font-medium text-emerald-600">{result.validRows}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Invalid:</span>
                              <div className="font-medium text-red-600">{result.invalidRows}</div>
                            </div>
                          </div>
                          {result.errors.length > 0 && (
                            <Button variant="outline" size="sm" onClick={() => setActiveTab("validation")}>
                              View {result.errors.length} Issues
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            {Object.entries(uploadResults).map(([dataTypeId, result]) => {
              const dataType = dataTypes.find((dt) => dt.id === dataTypeId)
              if (!dataType || result.errors.length === 0) return null

              return (
                <Card key={dataTypeId}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <StatusIcon status={result.status} />
                      {dataType.name} Validation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.errors.map((error, index) => (
                        <Alert key={index} variant={error.severity === "error" ? "destructive" : "default"}>
                          <div className="flex items-start gap-2">
                            {error.severity === "error" ? (
                              <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium">
                                Row {error.row}, Column "{error.column}"
                              </div>
                              <div className="text-sm">{error.message}</div>
                            </div>
                          </div>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {Object.keys(uploadResults).length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No validation results yet. Upload some files to see results here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {dataTypes.map((dataType) => (
                <Card key={dataType.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {dataType.name}
                      {dataType.required && <span className="text-red-500 ml-1">*</span>}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{dataType.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <strong>Sample columns:</strong>
                        <div className="mt-1 font-mono text-xs bg-gray-100 p-2 rounded">
                          {dataType.sampleData[0].join(", ")}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => downloadTemplate(dataType)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add this after the Tabs component */}
        {getOverallProgress() === 100 && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900">All Required Data Uploaded Successfully!</h3>
                  <p className="text-emerald-700">
                    Your institutional data has been imported and validated. You can now proceed to generate schedules.
                  </p>
                </div>
                <Button className="ml-auto bg-emerald-600 hover:bg-emerald-700">Generate Schedule</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
