"use client"

import { cn } from "@/lib/utils"
import { Calendar, Settings, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "MAIN",
    items: [
      {
        title: "My Schedule",
        href: "/teacher/schedule",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: "Set Constraints",
        href: "/teacher/constraints",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
]

export function TeacherSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/teacher/schedule" className="flex items-center gap-2 font-semibold text-emerald-600">
          <Calendar className="h-6 w-6" />
          <span className="text-lg">Teacher Portal</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {sidebarItems.map((group, i) => (
          <div key={i} className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-gray-500">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item, j) => (
                <Link
                  key={j}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Dr. Sarah Johnson</div>
              <div className="text-xs text-gray-500">Mathematics Dept.</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" title="Logout">
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}
