import { ClassroomType } from "../types";
import { Building } from "./building.types";

export type Classroom = {
  classroomId: string;
  name: string;
  capacity: number;
  type: ClassroomType;
  campusId: string;
  buildingId: string | null;
  isWheelchairAccessible: boolean;
  openingTime: string | null;
  closingTime: string | null;
  floor: number;
  campus: {
    name: string;
  };
  building?: Partial<Building> | null;
};
export type ClassroomCreating = {
  name: string;
  capacity: number;
  type: ClassroomType;
  buildingId: string | null;
  isWheelchairAccessible: boolean;
  openingTime: string | null;
  closingTime: string | null;
  floor: number;
};
export type ClassroomUpdating = Partial<ClassroomCreating>;
