import { Teacher, Room, StudentGroup, Building, Course, Alert, Metric, ScheduleResponse, SessionType } from './types'

// Mock data
const mockTeachers: Teacher[] = [
  {
    teacherId: "T001",
    userId: "U001",
    departmentId: "D001",
    user: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@university.edu",
    },
    department: {
      name: "Computer Science",
      campusId: "C001",
    },
  },
  {
    teacherId: "T002",
    userId: "U002",
    departmentId: "D002",
    user: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@university.edu",
    },
    department: {
      name: "Mathematics",
      campusId: "C002",
    },
  },
  {
    teacherId: "T003",
    userId: "U003",
    departmentId: "D003",
    user: {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@university.edu",
    },
    department: {
      name: "English",
      campusId: "C003",
    },
  },
  {
    teacherId: "T004",
    userId: "U004",
    departmentId: "D004",
    user: {
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@university.edu",
    },
    department: {
      name: "Physics",
      campusId: "C004",
    },
  },
  {
    teacherId: "T005",
    userId: "U005",
    departmentId: "D005",
    user: {
      firstName: "Robert",
      lastName: "Wilson",
      email: "robert.wilson@university.edu",
    },
    department: {
      name: "Biology",
      campusId: "C005",
    },
  },
]

const mockRooms: Room[] = [
  {
    id: "R001",
    name: "Room 101",
    capacity: 50,
    building: "Science Building",
    floor: 1,
    type: "Lecture Hall",
    isAccessible: true,
    facilities: ["Projector", "Whiteboard", "Computer"],
  },
  {
    id: "R002",
    name: "Room 205",
    capacity: 30,
    building: "Engineering Building",
    floor: 2,
    type: "Laboratory",
    isAccessible: false,
    facilities: ["Lab Equipment", "Whiteboard"],
  },
  {
    id: "R003",
    name: "Room 302",
    capacity: 25,
    building: "Arts Building",
    floor: 3,
    type: "Seminar Room",
    isAccessible: true,
    facilities: ["Projector", "Whiteboard"],
  },
  {
    id: "R004",
    name: "Room 150",
    capacity: 40,
    building: "Science Building",
    floor: 1,
    type: "Computer Lab",
    isAccessible: true,
    facilities: ["Computers", "Projector", "Whiteboard"],
  },
  {
    id: "R005",
    name: "Room 210",
    capacity: 60,
    building: "Engineering Building",
    floor: 2,
    type: "Lecture Hall",
    isAccessible: false,
    facilities: ["Projector", "Whiteboard", "Audio System"],
  },
]

const mockStudentGroups: StudentGroup[] = [
  {
    studentGroupId: "SG001",
    name: "CS-Y1",
    size: 45,
    accessibilityRequirement: false,
    departmentId: "D001",
    department: {
      name: "Computer Science",
      campusId: "C001",
    },
  },
  {
    studentGroupId: "SG002",
    name: "MATH-Y2",
    size: 30,
    accessibilityRequirement: false,
    departmentId: "D002",
    department: {
      name: "Mathematics",
      campusId: "C002",
    },
  },
  {
    studentGroupId: "SG003",
    name: "ENG-Y1",
    size: 35,
    accessibilityRequirement: false,
    departmentId: "D003",
    department: {
      name: "Engineering",
      campusId: "C003",
    },
  },
  {
    studentGroupId: "SG004",
    name: "PHYS-Y2",
    size: 25,
    accessibilityRequirement: false,
    departmentId: "D004",
    department: {
      name: "Physics",
      campusId: "C004",
    },
  },
  {
    studentGroupId: "SG005",
    name: "BIO-Y1",
    size: 40,
    accessibilityRequirement: false,
    departmentId: "D005",
    department: {
      name: "Biology",
      campusId: "C005",
    },
  },
]

const mockBuildings: Building[] = [
  {
    id: "B001",
    name: "Science Building",
    address: "123 University Ave",
    floors: 4,
    rooms: 40,
    isAccessible: true,
  },
  {
    id: "B002",
    name: "Engineering Building",
    address: "456 College St",
    floors: 5,
    rooms: 50,
    isAccessible: true,
  },
  {
    id: "B003",
    name: "Arts Building",
    address: "789 Campus Rd",
    floors: 3,
    rooms: 30,
    isAccessible: true,
  },
  {
    id: "B004",
    name: "Library",
    address: "321 Research Blvd",
    floors: 6,
    rooms: 20,
    isAccessible: true,
  },
  {
    id: "B005",
    name: "Student Center",
    address: "654 University Blvd",
    floors: 2,
    rooms: 15,
    isAccessible: true,
  },
]

const mockCourses: Course[] = [
  {
    id: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    sessions: 3,
    teacher: "T001",
    studentGroups: ["SG001"],
  },
  {
    id: "MATH201",
    name: "Calculus II",
    department: "Mathematics",
    sessions: 2,
    teacher: "T002",
    studentGroups: ["SG001", "SG002"],
  },
  {
    id: "ENG105",
    name: "Technical Writing",
    department: "English",
    sessions: 1,
    teacher: "T003",
    studentGroups: ["SG001", "SG003"],
  },
  {
    id: "PHYS202",
    name: "Electricity and Magnetism",
    department: "Physics",
    sessions: 4,
    teacher: "T004",
    studentGroups: ["SG002", "SG003", "SG004"],
  },
  {
    id: "BIO101",
    name: "Introduction to Biology",
    department: "Biology",
    sessions: 3,
    teacher: "T005",
    studentGroups: ["SG005"],
  },
]

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "error",
    title: "CSV Upload Failed: rooms.csv",
    message: "Invalid format at row 15. Room capacity must be a positive integer.",
    actionLink: "#",
    actionText: "View Details",
  },
  {
    id: "2",
    type: "warning",
    title: "3 Teachers have no availability set",
    message: "These teachers will be scheduled based on default availability.",
    actionLink: "#",
    actionText: "View Teachers",
  },
  {
    id: "3",
    type: "success",
    title: "Schedule Generation Complete",
    message: '"Fall 2025 - Initial Draft" has been generated successfully.',
    actionLink: "#",
    actionText: "View Schedule",
  },
  {
    id: "4",
    type: "info",
    title: "System Maintenance",
    message: "Scheduled maintenance on May 20, 2025 from 2:00 AM to 4:00 AM.",
    actionLink: "#",
    actionText: "Learn More",
  },
]

const mockMetrics: Metric[] = [
  {
    id: "1",
    title: "Total Courses",
    value: 142,
    change: {
      type: "increase",
      value: "8.5% from last semester",
    },
    icon: "courses",
  },
  {
    id: "2",
    title: "Teachers",
    value: 56,
    change: {
      type: "no-change",
      value: "No change from last semester",
    },
    icon: "teachers",
  },
  {
    id: "3",
    title: "Rooms",
    value: 38,
    change: {
      type: "increase",
      value: "3 new rooms added",
    },
    icon: "rooms",
  },
  {
    id: "4",
    title: "Student Groups",
    value: 24,
    change: {
      type: "decrease",
      value: "2 less than last semester",
    },
    icon: "student-groups",
  },
]

// Current schedule data
const mockCurrentSchedule = {
  name: "Fall 2025 - Draft Available",
  lastUpdated: "May 15, 2025, 10:30 AM",
}
export const mockScheduleData: ScheduleResponse = {
  "scheduleId": "07d9e275-cb07-4b3e-b5e9-c184bd883228",
  "sessions": [
    {
      "courseId": "course-001-L-G1",
      "courseName": "Fundamental of Electrical Circuits and Electronics",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-002",
      "classroomName": "NB112",
      "classGroupIds": ["sg-y3-se-s1"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "13:30-15:00",
      "day": "THURSDAY"
    },
    {
      "courseId": "course-001-L-G2",
      "courseName": "Fundamental of Electrical Circuits and Electronics",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-001",
      "classroomName": "NB111",
      "classGroupIds": ["sg-y3-se-s4"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "15:10-16:40",
      "day": "MONDAY"
    },
    {
      "courseId": "course-001-P-G1",
      "courseName": "Fundamental of Electrical Circuits and Electronics",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-004",
      "classroomName": "NB114",
      "classGroupIds": ["sg-y3-se-s1"],
      "sessionType": SessionType.LAB,
      "timeslot": "08:00-09:30",
      "day": "MONDAY"
    },
    {
      "courseId": "course-001-P-G2",
      "courseName": "Fundamental of Electrical Circuits and Electronics",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-004",
      "classroomName": "NB114",
      "classGroupIds": ["sg-y3-se-s4"],
      "sessionType": SessionType.LAB,
      "timeslot": "15:10-16:40",
      "day": "TUESDAY"
    },
    {
      "courseId": "course-002-L-G1",
      "courseName": "Computer Architecture and Organization",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-002",
      "classroomName": "NB112",
      "classGroupIds": ["sg-y3-se-s1"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "08:00-09:30",
      "day": "WEDNESDAY"
    },
    {
      "courseId": "course-002-L-G2",
      "courseName": "Computer Architecture and Organization",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-001",
      "classroomName": "NB111",
      "classGroupIds": ["sg-y3-se-s4"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "11:20-12:50",
      "day": "FRIDAY"
    },
    {
      "courseId": "course-003-L-G1",
      "courseName": "Web Design and Development",
      "teacherId": "teacher-002",
      "teacherName": "Natinael Wondimu",
      "classroomId": "classroom-002",
      "classroomName": "NB112",
      "classGroupIds": ["sg-y3-se-s1"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "15:10-16:40",
      "day": "WEDNESDAY"
    },
    {
      "courseId": "course-003-L-G2",
      "courseName": "Web Design and Development",
      "teacherId": "teacher-002",
      "teacherName": "Natinael Wondimu",
      "classroomId": "classroom-001",
      "classroomName": "NB111",
      "classGroupIds": ["sg-y3-se-s4"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "09:40-11:10",
      "day": "WEDNESDAY"
    },
    {
      "courseId": "course-003-P-G1",
      "courseName": "Web Design and Development",
      "teacherId": "teacher-002",
      "teacherName": "Natinael Wondimu",
      "classroomId": "classroom-004",
      "classroomName": "NB114",
      "classGroupIds": ["sg-y3-se-s1"],
      "sessionType": SessionType.LAB,
      "timeslot": "15:10-16:40",
      "day": "FRIDAY"
    },
    {
      "courseId": "course-003-P-G2",
      "courseName": "Web Design and Development",
      "teacherId": "teacher-002",
      "teacherName": "Natinael Wondimu",
      "classroomId": "classroom-004",
      "classroomName": "NB114",
      "classGroupIds": ["sg-y3-se-s4"],
      "sessionType": SessionType.LAB,
      "timeslot": "08:00-09:30",
      "day": "THURSDAY"
    },
    {
      "courseId": "course-004-L-G1",
      "courseName": "Human Computer Interaction",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-001",
      "classroomName": "NB111",
      "classGroupIds": ["sg-y3-se-s1"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "13:30-15:00",
      "day": "WEDNESDAY"
    },
    {
      "courseId": "course-004-L-G2",
      "courseName": "Human Computer Interaction",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-001",
      "classroomName": "NB111",
      "classGroupIds": ["sg-y3-se-s4"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "09:40-11:10",
      "day": "MONDAY"
    },
    {
      "courseId": "course-005-L-G1",
      "courseName": "Fundamentals of Software Engineering",
      "teacherId": "teacher-003",
      "teacherName": "Nebiat Tekle",
      "classroomId": "classroom-002",
      "classroomName": "NB112",
      "classGroupIds": ["sg-y3-se-s1"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "15:10-16:40",
      "day": "THURSDAY"
    },
    {
      "courseId": "course-005-L-G2",
      "courseName": "Fundamentals of Software Engineering",
      "teacherId": "teacher-003",
      "teacherName": "Nebiat Tekle",
      "classroomId": "classroom-002",
      "classroomName": "NB112",
      "classGroupIds": ["sg-y3-se-s4"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "13:30-15:00",
      "day": "WEDNESDAY"
    },
    {
      "courseId": "course-005-P-G1",
      "courseName": "Fundamentals of Software Engineering",
      "teacherId": "teacher-003",
      "teacherName": "Nebiat Tekle",
      "classroomId": "classroom-004",
      "classroomName": "NB114",
      "classGroupIds": ["sg-y3-se-s1"],
      "sessionType": SessionType.LAB,
      "timeslot": "11:20-12:50",
      "day": "FRIDAY"
    },
    {
      "courseId": "course-005-P-G2",
      "courseName": "Fundamentals of Software Engineering",
      "teacherId": "teacher-003",
      "teacherName": "Nebiat Tekle",
      "classroomId": "classroom-004",
      "classroomName": "NB114",
      "classGroupIds": ["sg-y3-se-s4"],
      "sessionType": SessionType.LAB,
      "timeslot": "08:00-09:30",
      "day": "FRIDAY"
    },
    {
      "courseId": "course-006-L-G1",
      "courseName": "Software Project Management",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-001",
      "classroomName": "NB111",
      "classGroupIds": ["sg-y4-se-s1"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "15:10-16:40",
      "day": "WEDNESDAY"
    },
    {
      "courseId": "course-006-L-G2",
      "courseName": "Software Project Management",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-002",
      "classroomName": "NB112",
      "classGroupIds": ["sg-y4-ai"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "11:20-12:50",
      "day": "WEDNESDAY"
    },

    {
      "courseId": "course-006-L-G3",
      "courseName": "Software Project Management",
      "teacherId": "teacher-1",
      "teacherName": "Abrham Gebremedhin",
      "classroomId": "classroom-001",
      "classroomName": "NB111",
      "classGroupIds": ["sg-y4-it"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "09:40-11:10",
      "day": "THURSDAY"
    },
    {
      "courseId": "course-007-L-G1",
      "courseName": "Enterprise Application Development",
      "teacherId": "teacher-002",
      "teacherName": "Natinael Wondimu",
      "classroomId": "classroom-002",
      "classroomName": "NB112",
      "classGroupIds": ["sg-y4-se-s1"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "11:20-12:50",
      "day": "TUESDAY"
    },
    {
      "courseId": "course-007-P-G1",
      "courseName": "Enterprise Application Development",
      "teacherId": "teacher-002",
      "teacherName": "Natinael Wondimu",
      "classroomId": "classroom-004",
      "classroomName": "NB114",
      "classGroupIds": ["sg-y4-se-s1"],
      "sessionType": SessionType.LAB,
      "timeslot": "11:20-12:50",
      "day": "WEDNESDAY"
    },
    {
      "courseId": "course-008-L-G1",
      "courseName": "History of Ethiopia and the Horn",
      "teacherId": "teacher-004",
      "teacherName": "Amanuel Tadesse",
      "classroomId": "classroom-001",
      "classroomName": "NB111",
      "classGroupIds": ["sg-y4-se-s1"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "15:10-16:40",
      "day": "FRIDAY"
    },
    {
      "courseId": "course-008-L-G2",
      "courseName": "History of Ethiopia and the Horn",
      "teacherId": "teacher-004",
      "teacherName": "Amanuel Tadesse",
      "classroomId": "classroom-001",
      "classroomName": "NB111",
      "classGroupIds": ["sg-y4-ai"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "11:20-12:50",
      "day": "TUESDAY"
    },
    {
      "courseId": "course-008-L-G3",
      "courseName": "History of Ethiopia and the Horn",
      "teacherId": "teacher-004",
      "teacherName": "Amanuel Tadesse",
      "classroomId": "classroom-002",
      "classroomName": "NB112",
      "classGroupIds": ["sg-y4-cy"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "11:20-12:50",
      "day": "FRIDAY"
    },
    {
      "courseId": "course-008-L-G4",
      "courseName": "History of Ethiopia and the Horn",
      "teacherId": "teacher-004",
      "teacherName": "Amanuel Tadesse",
      "classroomId": "classroom-002",
      "classroomName": "NB112",
      "classGroupIds": ["sg-y4-it"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "08:00-09:30",
      "day": "FRIDAY"
    },
    {
      "courseId": "course-009-L-G1",
      "courseName": "Machine Learning and Big Data",
      "teacherId": "teacher-005",
      "teacherName": "Bereket Haile",
      "classroomId": "classroom-001",
      "classroomName": "NB111",
      "classGroupIds": ["sg-y4-se-s1"],
      "sessionType": SessionType.LECTURE,
      "timeslot": "09:40-11:10",
      "day": "FRIDAY"
    },
    {
      "courseId": "course-009-P-G1",
      "courseName": "Machine Learning and Big Data",
      "teacherId": "teacher-005",
      "teacherName": "Bereket Haile",
      "classroomId": "classroom-004",
      "classroomName": "NB114",
      "classGroupIds": ["sg-y4-se-s1"],
      "sessionType": SessionType.LAB,
      "timeslot": "11:20-12:50",
      "day": "THURSDAY"
    }
  ]

};