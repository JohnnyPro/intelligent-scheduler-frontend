import { Upload, UserPlus, Download, Settings, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  return (
    <a href={action.link}>
      <Card className="transition-all hover:bg-gray-50 hover:shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="mb-3 rounded-full bg-indigo-100 p-3 text-indigo-600">{getIcon()}</div>
          <h3 className="text-center text-sm font-medium">{action.title}</h3>
        </CardContent>
      </Card>
    </a>
  )
}
