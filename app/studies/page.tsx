import type { Metadata, Viewport } from "next"
import StudyTracker from "@/components/study-tracker"

export const metadata: Metadata = {
  title: "Estudos - Painel de Organização",
  description: "Acompanhe seu progresso de estudos com plano adaptativo e IA integrada.",
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

export default function StudiesPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <StudyTracker />
      </div>
    </div>
  )
}
