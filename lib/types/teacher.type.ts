import { User } from "./users.types";
import { Department } from "./department.type";

export type Teacher = {
    teacherId: string;
    userId: string;
    departmentId: string;
    user: User;
    department: Department;
}
export type TeacherCreating = {
    userId: string;
    departmentId: string;
}
export type TeacherUpdating = Partial<Omit<TeacherCreating, "userId">>