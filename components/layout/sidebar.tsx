"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  FileSpreadsheet,
  Home,
  LayoutDashboard,
  School,
  Settings,
  Users,
  Building,
  LogOut,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/lib/stores/auth-store";

const sidebarItems = [
  {
    title: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        title: "View Schedule",
        href: "/admin/schedule/view",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: "Generate Schedule",
        href: "/admin/schedule/generate",
        icon: <FileSpreadsheet className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "DATA MANAGEMENT",
    items: [
      {
        title: "CSV Upload",
        href: "/admin/data/csv-upload",
        icon: <Upload className="h-5 w-5" />,
      },
      {
        title: "Courses & Sessions",
        href: "/admin/data/courses",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        title: "Teachers",
        href: "/admin/data/teachers",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Rooms",
        href: "/admin/data/rooms",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "Student Groups",
        href: "/admin/data/students",
        icon: <School className="h-5 w-5" />,
      },
      {
        title: "Buildings & Campuses",
        href: "/admin/data/buildings",
        icon: <Building className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        title: "User Management",
        href: "/admin/users",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-indigo-600"
        >
          <Calendar className="h-6 w-6" />
          <span className="text-lg">Intelligent Scheduler</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {sidebarItems.map((group, i) => (
          <div key={i} className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-semibold text-gray-500">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item, j) => (
                <Link
                  key={j}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-100"
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
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                {user.firstName.at(0)}
                {user.lastName.at(0)}
              </div>
              <div>
                <div className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={logout} title="Logout">
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
