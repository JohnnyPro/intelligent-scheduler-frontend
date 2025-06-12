
export type StudentGroup = {
   studentGroupId: string
   name: string
   size: number
   accessibilityRequirement: boolean
   departmentId: string
   students?: Student[]
   department: {
      name: string
      campusId: string
   }
}

export type Student = {
   studentId: string
   userId: string
}

export type StudentGroupCreating = {
   name: string
   size: number
   accessibilityRequirement: boolean
   departmentId: string
}


export type StudentGroupUpdating = Partial<StudentGroupCreating>