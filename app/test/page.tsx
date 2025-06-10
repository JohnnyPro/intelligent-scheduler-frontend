"use client"
import { useStore } from "@/lib/stores/store";
import { Classroom, ClassroomCreating, ClassroomType, ClassroomUpdating } from "@/lib/types";
import { useEffect } from "react";

export default function Test() {
   const { rooms, fetchRooms, updateRoom } = useStore();
   useEffect(() => {
      fetchRooms();
   }, [fetchRooms]);
   
   const newRoom: ClassroomUpdating = {
      name: "updated",
      capacity: 50,
      type: "LAB",
   }
   const del = () => {
      updateRoom("6a2735e8-73de-4b0d-a24c-b82cec51717b", newRoom);
   }

   return <div>
      <p>{rooms.length}</p>
      <button onClick={() => del()}>del</button>
   </div>



}