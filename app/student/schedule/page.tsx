"use client"

import { StudentLayout } from "@/components/layout/student-layout"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import useAuthStore from "@/lib/stores/auth-store"

export default function StudentSchedulePage() {
   const { user } = useAuthStore()

   return (
      <StudentLayout title="My Schedule">
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-bold tracking-tight">Welcome, {user?.firstName} {user?.lastName}</h2>
                  <p className="text-muted-foreground">
                     View your class schedule
                  </p>
               </div>
            </div>
            <ScheduleCalendar />
         </div>
      </StudentLayout>
   )
}
