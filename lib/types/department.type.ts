export type Department = {
  deptId: string;
  name: string;
  campusId: string;
  campus: {
    name: string;
  };
}

export type DepartmentCreating = {
  name: string;
}

export type DepartmentUpdating = {
  name: string;
}
