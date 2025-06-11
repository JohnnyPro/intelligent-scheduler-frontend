import type React from "react"
import { TeacherSidebar } from "@/components/layout/teacher-sidebar"
import { TeacherHeader } from "@/components/layout/teacher-header"

export function TeacherLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <TeacherSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TeacherHeader title={title} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
