import type { Metadata, Viewport } from "next"
import FinancialControl from "@/components/financial-control"

export const metadata: Metadata = {
  title: "Controle Financeiro - Painel de Organização",
  description: "Gerencie suas finanças pessoais com controle de receitas, despesas e orçamentos.",
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

export default function FinancesPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <FinancialControl />
      </div>
    </div>
  )
}
