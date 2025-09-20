import type { Metadata, Viewport } from "next"
import CalendarSchedule from "@/components/calendar-schedule"

export const metadata: Metadata = {
  title: "Calendário - Painel de Organização",
  description: "Organize seus compromissos, eventos e agenda pessoal de forma inteligente.",
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

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <CalendarSchedule />
      </div>
    </div>
  )
}
