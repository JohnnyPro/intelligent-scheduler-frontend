import type React from "react"
import { StudentSidebar } from "./student-sidebar"
import { StudentHeader } from "./student-header"

export function StudentLayout({
   children,
   title,
}: {
   children: React.ReactNode
   title: string
}) {
   return (
      <div className="flex h-screen bg-gray-50">
         <StudentSidebar />
         <div className="flex flex-1 flex-col overflow-hidden">
            <StudentHeader title={title} />
            <main className="flex-1 overflow-auto p-6">
               <div className="mx-auto max-w-7xl space-y-6">{children}</div>
            </main>
         </div>
      </div>
   )
} 