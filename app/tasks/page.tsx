import type { Metadata, Viewport } from "next"
import TaskManagement from "@/components/task-management"

export const metadata: Metadata = {
  title: "Tarefas - Painel de Organização",
  description: "Gerencie suas tarefas com priorização automática por IA e controle completo.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#059669" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <TaskManagement />
      </div>
    </div>
  )
}
