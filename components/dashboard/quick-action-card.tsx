import { Upload, UserPlus, Download, Settings, FileText, Calendar, FileSpreadsheet, Users, Building2, GraduationCap, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

type QuickAction = {
  id: string
  title: string
  icon: string
  link: string
}

export function QuickActionCard({ action }: { action: QuickAction }) {
  const getIcon = () => {
    switch (action.icon) {
      case "upload":
        return <Upload className="h-6 w-6" />
      case "user-plus":
        return <UserPlus className="h-6 w-6" />
      case "download":
        return <Download className="h-6 w-6" />
      case "settings":
        return <Settings className="h-6 w-6" />
      case "calendar":
        return <Calendar className="h-6 w-6" />
      case "file-spreadsheet":
        return <FileSpreadsheet className="h-6 w-6" />
      case "users":
        return <Users className="h-6 w-6" />
      case "building":
        return <Building2 className="h-6 w-6" />
      case "graduation-cap":
        return <GraduationCap className="h-6 w-6" />
      case "book-open":
        return <BookOpen className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  return (
    <Link href={action.link}>
      <Card className="transition-all hover:bg-gray-50 hover:shadow-md cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="mb-3 rounded-full bg-indigo-100 p-3 text-indigo-600">{getIcon()}</div>
          <h3 className="text-center text-sm font-medium">{action.title}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}
