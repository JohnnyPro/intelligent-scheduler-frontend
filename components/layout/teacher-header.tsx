"use client"

export function TeacherHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 items-center border-b bg-white px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  )
}
