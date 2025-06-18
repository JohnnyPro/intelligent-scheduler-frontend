"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export function StudentHeader({ title }: { title: string }) {
   return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semibold"></h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search..." className="w-64 rounded-md border pl-8 text-sm" />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
      </div>
    </header>
   )
} 