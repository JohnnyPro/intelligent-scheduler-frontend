"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/stores/store";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import useAuthStore from "@/lib/stores/auth-store";
import { CsvCategory, TaskStatus } from "@/lib/types";
import { uploadCsv } from "@/lib/repositories/repository";
import { useCsvStore } from "@/lib/stores/csv-validation.store";
import { TaskError, Severity } from "@/lib/types/csv-validation.types";
import PaginationControls from "@/components/ui/pagination-control";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete";


enum CsvStatus {
  EMPTY = "EMPTY",
  UPLOADING = "UPLOADING",
  QUEUED = "QUEUED",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

type ValidationError = {
  row: number;
  column: string;
  message: string;
  severity: "error" | "warning";
};

type UploadResult = {
  status: CsvStatus;
  file?: File;
  uploadedAt?: Date;
  error?: string;
  description?: string;
};

type DataType = {
  id: string;
  name: string;
  category: CsvCategory;
  description: string;
  dependencies: string[];
  sampleData: (string | number)[][];
  required: boolean;
};

const dataTypes: DataType[] = [
  {
    id: "departments",
    category: CsvCategory.DEPARTMENT,
    name: "Departments",
    description: "Academic departments and their information",
    dependencies: [],
    required: true,
    sampleData: [
      ["deptId", "name"],
      ["dpt-1a2b3g", "Computer Science"],
      ["dpt-4d5e6w", "Mathematics"],
    ],
  },

  {
    id: "courses",
    category: CsvCategory.COURSE,
    name: "Courses",
    description: "Course information and curriculum data",
    dependencies: ["departments"],
    required: true,
    sampleData: [
      [
        "courseId",
        "name",
        "code",
        "departmentId",
        "description",
        "sessionType",
        "sessionsPerWeek",
      ],
      [
        "crs-aaa111",
        "Introduction to AI",
        "AI101",
        "dpt-1a2b3g",
        "Foundations of AI",
        "LECTURE",
        3,
      ],
      [
        "crs-bbb222",
        "Linear Algebra",
        "LA201",
        "dpt-4d5e6w",
        "Matrix methods",
        "LAB",
        2,
      ],
    ],
  },

  {
    id: "teachers",
    category: CsvCategory.TEACHER,
    name: "Teachers",
    description: "Faculty and instructor information",
    dependencies: ["departments"],
    required: true,
    sampleData: [
      [
        "teacherId",
        "firstName",
        "lastName",
        "email",
        "password",
        "phone",
        "role",
        "departmentId",
        "needWheelchairAccessibleRoom",
      ],
      [
        "tch-xyz789",
        "Alice",
        "Smith",
        "alice.smith@example.com",
        "securePass123",
        "555-0100",
        "TEACHER",
        "dpt-1a2b3g",
        "false",
      ],
      [
        "tch-opq456",
        "Bob",
        "Jones",
        "bob.jones@example.com",
        "securePass456",
        "555-0200",
        "TEACHER",
        "dpt-1a2b3g",
        "true",
      ],
    ],
  },

  {
    id: "classrooms",
    category: CsvCategory.CLASSROOM,
    name: "classrooms",
    description: "Classroom and facility information",
    dependencies: [],
    required: true,
    sampleData: [
      [
        "classroomId",
        "name",
        "capacity",
        "type",
        "buildingId",
        "isWheelchairAccessible",
        "openingTime",
        "closingTime",
        "floor",
      ],
      [
        "cls-1001",
        "Room 101",
        40,
        "LECTURE",
        "bdg-10",
        "false",
        "08:00",
        "17:00",
        1,
      ],
      [
        "cls-1002",
        "Laboratory 1",
        20,
        "LAB",
        "bdg-11",
        "true",
        "09:00",
        "18:00",
        2,
      ],
    ],
  },

  {
    id: "student-groups",
    category: CsvCategory.STUDENTGROUP,
    name: "Student Groups",
    description: "Class sections and student cohorts",
    dependencies: ["departments"],
    required: true,
    sampleData: [
      [
        "studentGroupId",
        "name",
        "size",
        "accessibilityRequirement",
        "departmentId",
      ],
      ["sgp-111aaa", "Group A", 25, "false", "dpt-1a2b3g"],
      ["sgp-222bbb", "Group B", 30, "true", "dpt-4d5e6w"],
    ],
  },

  {
    id: "students",
    category: CsvCategory.STUDENT,
    name: "Students",
    description: "Individual student records",
    dependencies: ["student-groups"],
    required: false,
    sampleData: [
      [
        "studentId",
        "firstName",
        "lastName",
        "email",
        "password",
        "phone",
        "role",
        "needWheelchairAccessibleRoom",
        "studentGroupId",
      ],
      [
        "std-aaa111",
        "Charlie",
        "Brown",
        "charlie.brown@example.com",
        "myPass!",
        "555-0300",
        "STUDENT",
        "false",
        "sgp-111aaa",
      ],
      [
        "std-bbb222",
        "Dana",
        "White",
        "dana.white@example.com",
        "password",
        "555-0400",
        "STUDENT",
        "true",
        "sgp-222bbb",
      ],
    ],
  },

  {
    id: "student-group-courses",
    category: CsvCategory.SGCOURSE,
    name: "Student Group Courses",
    description:
      "Links between student groups and their courses with teacher assignments",
    dependencies: ["courses", "student-groups", "teachers"],
    required: true,
    sampleData: [
      ["studentGroupId", "courseId", "teacherId"],
      ["sgp-111aaa", "crs-aaa111", "tch-xyz789"],
      ["sgp-222bbb", "crs-bbb222", "tch-opq456"],
    ],
  },
];

export default function CSVUploadPage() {
  const {
    tasks,
    selectedTask,
    uploadCsv,
    fetchAllTasks,
    fetchTask,
    isLoading,
    error,
    deleteTask,
    pagination,
    downloadTemplate: downloadTemplateFromStore,
  } = useCsvStore();
  const [uploadResults, setUploadResults] = useState<
    Record<string, UploadResult>
  >({});
  const [activeTab, setActiveTab] = useState("upload");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const [fileDescriptions, setFileDescriptions] = useState<
    Record<string, string>
  >({});
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);

  const getCsvStatus = (dataTypeId: string): CsvStatus => {
    return uploadResults[dataTypeId]?.status || CsvStatus.EMPTY;
  };

  const canUpload = (dataType: DataType): boolean => {
    return dataType.dependencies.every(
      (dep) =>
        getCsvStatus(dep) === CsvStatus.QUEUED ||
        getCsvStatus(dep) === CsvStatus.COMPLETED
    );
  };

  const handleFileSelect = (dataTypeId: string, file: File) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [dataTypeId]: file,
    }));
  };

  const handleDescriptionChange = (dataTypeId: string, description: string) => {
    setFileDescriptions((prev) => ({
      ...prev,
      [dataTypeId]: description,
    }));
  };

  const handleUpload = async (dataTypeId: string) => {
    const file = selectedFiles[dataTypeId];
    const description = fileDescriptions[dataTypeId];
    if (file) {
      await handleFileUpload(dataTypeId, file, description);
      // Clear the selected file and description after upload
      setSelectedFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[dataTypeId];
        return newFiles;
      });
      setFileDescriptions((prev) => {
        const newDescriptions = { ...prev };
        delete newDescriptions[dataTypeId];
        return newDescriptions;
      });
    }
  };

  const handleFileUpload = async (
    dataTypeId: string,
    file: File,
    description?: string
  ) => {
    setUploadResults((prev) => ({
      ...prev,
      [dataTypeId]: {
        status: CsvStatus.UPLOADING,
        file,
        description,
      },
    }));

    try {
      const category = dataTypes.find((dt) => dt.id === dataTypeId)!.category;
      await uploadCsv(file, category, description);

      setUploadResults((prev) => ({
        ...prev,
        [dataTypeId]: {
          status: CsvStatus.QUEUED,
          file,
          description,
          uploadedAt: new Date(),
        },
      }));
      await fetchAllTasks();
    } catch (error) {
      setUploadResults((prev) => ({
        ...prev,
        [dataTypeId]: {
          status: CsvStatus.FAILED,
          file,
          description,
          error: error instanceof Error ? error.message : "Upload failed",
          uploadedAt: new Date(),
        },
      }));
    }
  };

  const downloadTemplate = async (dataType: DataType) => {
    try {
      const blob = await downloadTemplateFromStore(dataType.category);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${dataType.id}-template.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download template:", error);
    }
  };

  const resetUpload = (dataTypeId: string) => {
    setUploadResults((prev) => {
      const newResults = { ...prev };
      delete newResults[dataTypeId];
      return newResults;
    });
  };

  const resetAllUploads = () => {
    setUploadResults({});
  };

  const getOverallProgress = () => {
    const requiredTypes = dataTypes.filter((dt) => dt.required);

    const completedRequired = requiredTypes.filter((dt) => {
      const status = getCsvStatus(dt.id);
      return status === CsvStatus.COMPLETED || status === CsvStatus.QUEUED;
    }).length;

    const progress = (completedRequired / requiredTypes.length) * 100;
    console.log("Calculated overall progress:", progress);

    return progress;
  };

  const StatusIcon = ({
    status,
    errorCount,
  }: {
    status: CsvStatus;
    errorCount?: number;
  }) => {
    console.log("status icon: ", status);
    switch (status) {
      case CsvStatus.COMPLETED:
        if (errorCount && errorCount > 0) {
          return <AlertTriangle className="h-5 w-5 text-amber-500" />;
        }
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case CsvStatus.FAILED:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case CsvStatus.UPLOADING:
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCsvStatusFromTaskStatus = (
    taskStatus: TaskStatus,
    errorCount: number
  ) => {
    if (taskStatus === TaskStatus.FAILED) {
      return CsvStatus.FAILED;
    }
    if (taskStatus === TaskStatus.COMPLETED) {
      return CsvStatus.COMPLETED;
    }
    return CsvStatus.QUEUED;
  };

  const handleExpand = async (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
      setIsDetailLoading(true);
      await fetchTask(taskId);
      setIsDetailLoading(false);
    }
  };

  // Set up polling for tasks
  useEffect(() => {
    if (activeTab === "validation") {
      // Initial fetch
      fetchAllTasks();

      // Set up polling interval
      const interval = setInterval(() => {
        fetchAllTasks();
      }, 5000); // Poll every 5 seconds

      // Cleanup interval on unmount or tab change
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchAllTasks]);

  // Show error alert if there's an error
  useEffect(() => {
    if (error) {
      // You might want to use a toast notification here instead
      console.error("Store error:", error);
    }
  }, [error]);

  // Helper function to generate log text
  const generateErrorLog = (errors: TaskError[]) => {
    return errors
      .map(
        (err, idx) =>
          `Row ${err.row}${err.column ? `, Column: ${err.column}` : ""}\n${
            err.message
          }\nSeverity: ${err.severity}\n`
      )
      .join("\n----------------------\n");
  };

  const handleDownloadErrors = (errors: TaskError[]) => {
    const log = generateErrorLog(errors);
    const blob = new Blob([log], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "validation-errors.log";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Function to detect CSV category from filename
  const detectCategoryFromFilename = (filename: string): CsvCategory | null => {
    const name = filename.toLowerCase();
    if (name.includes("department")) return CsvCategory.DEPARTMENT;
    if (name.includes("course")) return CsvCategory.COURSE;
    if (name.includes("teacher")) return CsvCategory.TEACHER;
    if (name.includes("classroom")) return CsvCategory.CLASSROOM;
    if (name.includes("student-group") || name.includes("studentgroup"))
      return CsvCategory.STUDENTGROUP;
    if (name.includes("student") && !name.includes("group"))
      return CsvCategory.STUDENT;
    if (name.includes("sgcourse") || name.includes("student-group-course"))
      return CsvCategory.SGCOURSE;
    return null;
  };

  // Function to handle bulk upload
  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) return;

    setIsBulkUploading(true);

    // Categorize files
    const categorizedFiles: Record<CsvCategory, File[]> = {
      [CsvCategory.DEPARTMENT]: [],
      [CsvCategory.COURSE]: [],
      [CsvCategory.TEACHER]: [],
      [CsvCategory.CLASSROOM]: [],
      [CsvCategory.STUDENTGROUP]: [],
      [CsvCategory.STUDENT]: [],
      [CsvCategory.SGCOURSE]: [],
    };

    // Group files by detected category
    for (const file of bulkFiles) {
      const category = detectCategoryFromFilename(file.name);
      if (category) {
        categorizedFiles[category].push(file);
      }
    }

    // Upload in dependency order
    const uploadOrder = [
      CsvCategory.DEPARTMENT,
      CsvCategory.COURSE,
      CsvCategory.TEACHER,
      CsvCategory.CLASSROOM,
      CsvCategory.STUDENTGROUP,
      CsvCategory.STUDENT,
      CsvCategory.SGCOURSE,
    ];

    try {
      for (const category of uploadOrder) {
        const files = categorizedFiles[category];
        if (files.length > 0) {
          // Upload all files of this category
          for (const file of files) {
            const dataType = dataTypes.find((dt) => dt.category === category);
            if (dataType) {
              await handleFileUpload(
                dataType.id,
                file,
                `Bulk upload: ${file.name}`
              );
              // Small delay between uploads to avoid overwhelming the server
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }
        }
      }

      // Refresh tasks after all uploads
      await fetchAllTasks();
      setBulkFiles([]);
    } catch (error) {
      console.error("Bulk upload failed:", error);
    } finally {
      setIsBulkUploading(false);
    }
  };

  const handleBulkFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setBulkFiles(files);
  };

  const errors = selectedTask?.errors || [];
  const showDownload = errors.length > 3;
  const errorsToShow = showDownload ? errors.slice(0, 3) : errors;

  return (
    <DashboardLayout title="CSV Data Upload">
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">CSV Data Upload</h2>
            <p className="text-gray-500">
              Upload your institutional data using CSV files
            </p>
          </div>
          <Button
            variant="outline"
            onClick={resetAllUploads}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
            />
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
                <strong>Upload Order:</strong> Files must be uploaded in
                dependency order. Departments → Courses/Teachers/Student Groups
                → Students/Student Group Courses
              </AlertDescription>
            </Alert>

            {/* Bulk Upload Section for Debugging */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Upload className="h-5 w-5" />
                  Bulk Upload All CSVs
                </CardTitle>
                <p className="text-sm text-blue-700">
                  Upload multiple CSV files at once. Files will be automatically
                  categorized by filename and uploaded in dependency order.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bulk-upload" className="text-sm font-medium">
                    Select multiple CSV files
                  </Label>
                  <Input
                    id="bulk-upload"
                    type="file"
                    accept=".csv"
                    multiple
                    onChange={handleBulkFileSelect}
                    disabled={isBulkUploading}
                    className="mt-1"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    Tip: Name your files with keywords like "department",
                    "course", "teacher", "classroom", "student-group",
                    "student", "sgcourse" for automatic detection.
                  </p>
                </div>

                {bulkFiles.length > 0 && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-2">
                        Selected Files ({bulkFiles.length}):
                      </h4>
                      <div className="grid gap-2 max-h-32 overflow-y-auto">
                        {bulkFiles.map((file, index) => {
                          const detectedCategory = detectCategoryFromFilename(
                            file.name
                          );
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs bg-white p-2 rounded border"
                            >
                              <span className="font-mono truncate">
                                {file.name}
                              </span>
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  detectedCategory
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                )}
                              >
                                {detectedCategory || "Unknown"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleBulkUpload}
                        disabled={isBulkUploading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isBulkUploading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload All ({bulkFiles.length} files)
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setBulkFiles([])}
                        disabled={isBulkUploading}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {dataTypes.map((dataType) => {
                const status = getCsvStatus(dataType.id);
                const canUploadFile = canUpload(dataType);
                const result = uploadResults[dataType.id];

                return (
                  <Card
                    key={dataType.id}
                    className={cn(
                      "transition-all",
                      status === CsvStatus.COMPLETED &&
                        "border-emerald-200 bg-emerald-50",
                      status === CsvStatus.FAILED && "border-red-200 bg-red-50",
                      !canUploadFile &&
                        status === CsvStatus.QUEUED &&
                        "opacity-60"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StatusIcon status={status} errorCount={0} />
                          <div>
                            <CardTitle className="text-lg">
                              {dataType.name}
                              {dataType.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                              {dataType.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {status === CsvStatus.QUEUED && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resetUpload(dataType.id)}
                            >
                              Reset
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadTemplate(dataType)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Template
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {dataType.dependencies.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Dependencies:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {dataType.dependencies.map((dep) => {
                              const depType = dataTypes.find(
                                (dt) => dt.id === dep
                              );
                              const depStatus = getCsvStatus(dep);
                              return (
                                <span
                                  key={dep}
                                  className={cn(
                                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                    depStatus === CsvStatus.COMPLETED &&
                                      "bg-emerald-100 text-emerald-700",
                                    depStatus !== CsvStatus.COMPLETED &&
                                      "bg-gray-100 text-gray-600"
                                  )}
                                >
                                  {depStatus === CsvStatus.COMPLETED ? (
                                    <CheckCircle className="h-3 w-3" />
                                  ) : (
                                    <Clock className="h-3 w-3" />
                                  )}
                                  {depType?.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {status === CsvStatus.EMPTY && (
                        <div className="space-y-3">
                          <div>
                            <Label
                              htmlFor={`file-${dataType.id}`}
                              className="text-sm font-medium"
                            >
                              Choose CSV file
                            </Label>
                            <Input
                              id={`file-${dataType.id}`}
                              type="file"
                              accept=".csv"
                              disabled={!canUploadFile}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileSelect(dataType.id, file);
                                }
                              }}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`description-${dataType.id}`}
                              className="text-sm font-medium"
                            >
                              Description (optional)
                            </Label>
                            <Input
                              id={`description-${dataType.id}`}
                              type="text"
                              placeholder="Add a description to identify this upload"
                              disabled={!canUploadFile}
                              value={fileDescriptions[dataType.id] || ""}
                              onChange={(e) =>
                                handleDescriptionChange(
                                  dataType.id,
                                  e.target.value
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          {selectedFiles[dataType.id] && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <FileText className="h-4 w-4" />
                                  <span>{selectedFiles[dataType.id].name}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleUpload(dataType.id)}
                                disabled={!canUploadFile}
                              >
                                Upload
                              </Button>
                            </div>
                          )}
                          {!canUploadFile && (
                            <p className="text-xs text-gray-500 mt-1">
                              Complete dependencies first
                            </p>
                          )}
                        </div>
                      )}

                      {status === CsvStatus.UPLOADING && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Uploading file...</span>
                          </div>
                          <Progress value={30} className="h-2" />
                        </div>
                      )}

                      {result &&
                        (status === CsvStatus.QUEUED ||
                          status === CsvStatus.FAILED) && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                {result.file?.name}
                              </span>
                            </div>
                            {status === CsvStatus.FAILED && (
                              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                                <div className="flex items-start gap-3">
                                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                                  <div>
                                    <h4 className="font-medium text-red-900">
                                      Upload Failed
                                    </h4>
                                    <p className="mt-1 text-sm text-red-700">
                                      {result.error ||
                                        "Failed to upload file. Please try again."}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            {tasks.length > 0 ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  {pagination && (
                    <PaginationControls
                      pagination={pagination}
                      onPaginationChange={(newPage: number, newSize: number) =>
                        fetchAllTasks(newPage, newSize)
                      }
                    />
                  )}
                </div>
                {tasks.map((allTaskInst) => {
                  const {
                    taskId,
                    status: taskStatus,
                    errorCount,
                    fileName,
                    description,
                    createdAt,
                  } = allTaskInst;

                  console.log(
                    `Task ID: ${taskId}, File Name: ${fileName}, Description: ${description}`
                  );

                  const csvStatus = getCsvStatusFromTaskStatus(
                    taskStatus,
                    errorCount
                  );

                  return (
                    <Card key={taskId}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <StatusIcon
                            status={csvStatus}
                            errorCount={errorCount}
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-base text-gray-900">
                              {fileName}
                            </span>
                            <div className="text-sm text-gray-500 truncate mt-0.5">
                              {description || "No description provided"}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setTaskIdToDelete(taskId);
                                setIsConfirmDeleteDialogOpen(true);
                              }}
                            >
                              Delete Task
                            </Button>
                            <span className="text-xs text-gray-400">
                              {createdAt &&
                                new Date(createdAt).toLocaleString()}
                            </span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {taskStatus === TaskStatus.FAILED && (
                            <span className="flex items-center gap-2 text-red-700 font-medium">
                              <XCircle className="inline h-4 w-4 text-red-500" />
                              CSV validation failed. The file contains invalid
                              data or incorrect format.
                            </span>
                          )}
                          {taskStatus === TaskStatus.COMPLETED &&
                            errorCount > 0 && (
                              <span className="flex items-center gap-2 text-amber-700 font-medium">
                                <AlertTriangle className="inline h-4 w-4 text-amber-500" />
                                {errorCount} database-related error
                                {errorCount > 1 ? "s" : ""} occurred during
                                import.
                              </span>
                            )}
                          {taskStatus === TaskStatus.COMPLETED &&
                            errorCount === 0 && (
                              <span className="flex items-center gap-2 text-emerald-700 font-medium">
                                <CheckCircle className="inline h-4 w-4 text-emerald-500" />
                                No errors found. Validation and import completed
                                successfully.
                              </span>
                            )}
                          {taskStatus === TaskStatus.QUEUED && (
                            <span className="flex items-center gap-2 text-gray-500 font-medium">
                              <Clock className="inline h-4 w-4 text-gray-400" />
                              Validation is queued and will start soon.
                            </span>
                          )}

                          {(taskStatus === TaskStatus.FAILED ||
                            (taskStatus === TaskStatus.COMPLETED &&
                              errorCount > 0)) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExpand(taskId)}
                              className="mt-2"
                            >
                              {expandedTaskId === taskId ? (
                                <>
                                  <ChevronUp className="mr-2 h-4 w-4" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="mr-2 h-4 w-4" />
                                  View Details
                                </>
                              )}
                            </Button>
                          )}

                          {expandedTaskId === taskId &&
                            (isDetailLoading ? (
                              <div className="flex items-center justify-center py-4">
                                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-500">
                                  Loading details...
                                </span>
                              </div>
                            ) : selectedTask &&
                              selectedTask.taskId === taskId ? (
                              <div className="mt-4 space-y-4">
                                <div className="rounded-lg border border-gray-200 overflow-hidden">
                                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="font-medium text-gray-900">
                                          Validation Results
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                          {selectedTask.errors?.length} error
                                          {selectedTask.errors?.length !== 1
                                            ? "s"
                                            : ""}{" "}
                                          found
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="divide-y divide-gray-200">
                                    {errorsToShow.map(
                                      (error: TaskError, index: number) => (
                                        <div
                                          key={index}
                                          className="p-4 hover:bg-gray-50 transition-colors"
                                        >
                                          <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                              <XCircle className="h-5 w-5 text-red-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900">
                                                  Row {error.row}
                                                </span>
                                                {error.column && (
                                                  <>
                                                    <span className="text-gray-400">
                                                      •
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                      Column: {error.column}
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                              <p className="mt-1 text-sm text-gray-600">
                                                {error.message}
                                              </p>
                                              {error.severity && (
                                                <div className="mt-2">
                                                  <span
                                                    className={cn(
                                                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                      error.severity ===
                                                        Severity.ERROR
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-amber-100 text-amber-700"
                                                    )}
                                                  >
                                                    {error.severity ===
                                                    Severity.ERROR
                                                      ? "Error"
                                                      : "Warning"}
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                    {showDownload && (
                                      <div className="pt-4 flex justify-end">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleDownloadErrors(errors)
                                          }
                                        >
                                          <Download className="mr-2 h-4 w-4" />
                                          Download All Errors
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>No details available</div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No validation results yet. Upload some files to see results
                    here.
                  </p>
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
                      {dataType.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {dataType.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <strong>Sample columns:</strong>
                        <div className="mt-1 font-mono text-xs bg-gray-100 p-2 rounded">
                          {dataType.sampleData[0].join(", ")}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => downloadTemplate(dataType)}
                      >
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
                  <h3 className="text-lg font-semibold text-emerald-900">
                    All Required Data Uploaded Successfully!
                  </h3>
                  <p className="text-emerald-700">
                    Your institutional data has been imported and validated. You
                    can now proceed to generate schedules.
                  </p>
                </div>
                <Button className="ml-auto bg-emerald-600 hover:bg-emerald-700">
                  Generate Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <ConfirmDeleteDialog
          open={isConfirmDeleteDialogOpen}
          onOpenChange={setIsConfirmDeleteDialogOpen}
          title="Delete Task"
          description="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            if (taskIdToDelete) {
              deleteTask(taskIdToDelete);
              setTaskIdToDelete(null);
            }
          }}
          onCancel={() => setTaskIdToDelete(null)}
        />
      </div>
    </DashboardLayout>
  );
}
