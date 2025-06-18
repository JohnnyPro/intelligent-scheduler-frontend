import { User } from "./users.types";
import { Department } from "./department.type";
import { Course } from "./course.types";

export type Teacher = {
    teacherId: string;
    userId: string;
    departmentId: string;
    user: User;
    department: Department;
    courses: Course[];
}
export type TeacherCreating = {
    userId: string;
    departmentId: string;
}
export type TeacherUpdating = {
    teacherId: string;
    departmentId?: string;
    courseId?: string;
}