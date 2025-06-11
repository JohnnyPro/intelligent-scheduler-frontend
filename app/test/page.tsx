"use client"
import { useStudentGroupStore } from "@/lib/stores/student-group.store";
import { StudentGroup, StudentGroupUpdating } from "@/lib/types/student-group.types";
import { useEffect } from "react";

export default function Test() {
   const { studentGroups, fetchStudentGroups, deleteStudentGroup } = useStudentGroupStore();
   useEffect(() => {
      fetchStudentGroups();
   }, [fetchStudentGroups]);
   
   const updatedGroup: StudentGroupUpdating = {
      name: "new",
      size: 30,
   }
   const update = () => {
      deleteStudentGroup("a24d0876-80c9-49e5-abad-0266ff91034d");
   }

   return <div>
      <p>{studentGroups.length}</p>
      <button onClick={() => update()}>Update</button>
   </div>



}
