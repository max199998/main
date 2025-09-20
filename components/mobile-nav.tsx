"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  Calendar,
  CheckSquare,
  Target,
  Mic,
  BookOpen,
  Shield,
  DollarSign,
  Dumbbell,
  Brain,
  Smartphone,
  Settings,
  User,
} from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const navItems = [
    { icon: Calendar, label: "Agenda", href: "/calendar", badge: "3" },
    { icon: CheckSquare, label: "Tarefas", href: "/tasks", badge: "8" },
    { icon: Target, label: "Modo Foco", href: "/focus", badge: "Novo" },
    { icon: Mic, label: "Notas de Voz", href: "/voice-notes", badge: "IA" },
    { icon: BookOpen, label: "Estudos", href: "/studies", badge: "4" },
    { icon: Shield, label: "Bem-estar", href: "/wellness", badge: "Novo" },
    { icon: DollarSign, label: "Finanças", href: "/finances", badge: "IA" },
    { icon: Dumbbell, label: "Treinos", href: "/workouts", badge: "IA" },
    { icon: Brain, label: "Núcleo IA", href: "/ai-hub", badge: "Central" },
    { icon: Smartphone, label: "PWA Mobile", href: "/mobile", badge: "PWA" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden bg-transparent">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Painel @_maxchaves</h2>
            <p className="text-sm text-muted-foreground">Navegação rápida</p>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              </Link>
            ))}
          </nav>

          <div className="border-t pt-4 space-y-2">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span>Configurações</span>
            </Link>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <User className="h-5 w-5 text-muted-foreground" />
              <span>Perfil</span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
