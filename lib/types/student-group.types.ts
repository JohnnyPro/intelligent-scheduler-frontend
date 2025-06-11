
export type StudentGroup = {
   studentGroupId: string
   name: string
   size: number
   accessibilityRequirement: boolean
   departmentId: string
   department: {
      name: string
      campusId: string
   }
}


export type StudentGroupCreating = {
   name: string
   size: number
   accessibilityRequirement: boolean
   departmentId: string
}


export type StudentGroupUpdating = Partial<StudentGroupCreating>