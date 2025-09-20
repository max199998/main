"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  BookOpen,
  Target,
  DollarSign,
  Dumbbell,
  Apple,
  GraduationCap,
  Palette,
  Film,
  MapPin,
  ShoppingCart,
  User,
  Smartphone,
  Brain,
  Zap,
  TrendingUp,
  Shield,
  Mic,
  Moon,
  Sun,
  Wifi,
  WifiOff,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import NotificationCenter from "@/components/notification-center"
import { useNotifications } from "@/lib/notifications"

export default function PersonalDashboard() {
  const { theme, setTheme } = useTheme()
  const [isOnline, setIsOnline] = useState(true)
  const [mounted, setMounted] = useState(false)

  const { add: addNotification } = useNotifications()

  useEffect(() => {
    setMounted(true)
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setTimeout(() => {
      addNotification({
        title: "Dashboard Carregado",
        message: "Bem-vindo ao seu painel de produtividade! Todos os módulos estão funcionando.",
        type: "success",
      })
    }, 2000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [addNotification])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Controls */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Painel de Organização @_maxchaves</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Sistema completo de produtividade pessoal com IA integrada
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8 p-0"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <NotificationCenter />

              <div className="flex items-center gap-1">
                {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                IA Insights: Você está 23% mais produtivo esta semana!
              </span>
              <Badge variant="secondary" className="ml-auto">
                <TrendingUp className="h-3 w-3 mr-1" />
                +23%
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Main Grid with better mobile optimization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Agenda - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Agenda
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                Agenda inteligente com sugestões automáticas
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Hoje</span>
                  <Badge variant="secondary">3 eventos</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Conflitos detectados</span>
                  <Badge variant="destructive">1</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Tempo livre</span>
                  <Badge variant="default">2h 30m</Badge>
                </div>
              </div>
              <Link href="/calendar">
                <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                  Ver Agenda
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gestão de Tarefas - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Tarefas
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Priorização automática por IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Alta prioridade</span>
                  <Badge variant="destructive">3</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Em andamento</span>
                  <Badge variant="secondary">5</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Sugestões IA</span>
                  <Badge variant="default">2 novas</Badge>
                </div>
              </div>
              <Link href="/tasks">
                <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                  Gerenciar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                Modo Foco
                <Badge variant="secondary" className="text-xs">
                  Novo
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Deep work com bloqueio de distrações</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Sessão atual</span>
                  <Badge variant="default">25:00</Badge>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-center">Pomodoro ativo</p>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm bg-transparent" variant="outline">
                Iniciar Foco
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Notas de Voz
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Transcrição automática e resumos</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Gravações hoje</span>
                  <Badge variant="secondary">4</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Transcritas</span>
                  <Badge variant="default">4/4</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                <Mic className="h-3 w-3 mr-1" />
                Gravar
              </Button>
            </CardContent>
          </Card>

          {/* Estudos - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Estudos
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Plano de estudos adaptativo</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Retenção média</span>
                  <Badge variant="default">87%</Badge>
                </div>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-center">Meta semanal: 78%</p>
              </div>
              <Link href="/studies">
                <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                  Estudar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                Bem-estar
                <Badge variant="secondary" className="text-xs">
                  Novo
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Saúde mental e física integrada</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Humor hoje</span>
                  <Badge variant="default">😊 Bom</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Estresse</span>
                  <Badge variant="secondary">Baixo</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Check-in
              </Button>
            </CardContent>
          </Card>

          {/* Finanças - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Finanças
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Insights financeiros inteligentes</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Saldo atual</span>
                  <Badge variant="default">R$ 2.450</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Economia sugerida</span>
                  <Badge variant="secondary">R$ 180</Badge>
                </div>
              </div>
              <Link href="/finances">
                <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                  Ver Detalhes
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Treinos - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Treinos
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Planos adaptativos de treino</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Esta semana</span>
                  <Badge variant="default">4/5 treinos</Badge>
                </div>
                <Progress value={80} className="h-2" />
                <p className="text-xs text-center">Recuperação: Ótima</p>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Treinar
              </Button>
            </CardContent>
          </Card>

          {/* Rotina Diária - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Rotina Diária
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Planeje seu dia completo com IA</p>
              <div className="space-y-2">
                <Progress value={65} className="h-2" />
                <p className="text-xs text-center">65% do dia concluído</p>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Ver Rotina
              </Button>
            </CardContent>
          </Card>

          {/* Notas - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Notas
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Anotações categorizadas com IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Total</span>
                  <Badge variant="outline">47 notas</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Recentes</span>
                  <Badge variant="secondary">5</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Abrir Notas
              </Button>
            </CardContent>
          </Card>

          {/* Livros & Leituras - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Leituras
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Progresso e avaliações com IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Lendo agora</span>
                  <Badge variant="secondary">2 livros</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Concluídos</span>
                  <Badge variant="default">23</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Ver Biblioteca
              </Button>
            </CardContent>
          </Card>

          {/* Hábitos & Metas - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Hábitos & Metas
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Monitore seu progresso com IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Hábitos hoje</span>
                  <Badge variant="default">6/8</Badge>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-center">85% das metas no prazo</p>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Acompanhar
              </Button>
            </CardContent>
          </Card>

          {/* Dieta - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Apple className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Dieta
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Refeições e receitas com IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Calorias hoje</span>
                  <Badge variant="secondary">1.850/2.200</Badge>
                </div>
                <Progress value={84} className="h-2" />
                <p className="text-xs text-center">84% da meta diária</p>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Registrar
              </Button>
            </CardContent>
          </Card>

          {/* Cursos Online - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Cursos Online
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Workshops e aprendizado com IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Em andamento</span>
                  <Badge variant="secondary">3 cursos</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Concluídos</span>
                  <Badge variant="default">12</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Continuar
              </Button>
            </CardContent>
          </Card>

          {/* Hobbies - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Hobbies
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Projetos criativos com IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Projetos ativos</span>
                  <Badge variant="secondary">2</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Concluídos</span>
                  <Badge variant="default">8</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Explorar
              </Button>
            </CardContent>
          </Card>

          {/* Filmes & Séries - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Film className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Entretenimento
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Filmes, séries e podcasts com IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Assistindo</span>
                  <Badge variant="secondary">4 séries</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Lista de desejos</span>
                  <Badge variant="outline">23 itens</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Ver Lista
              </Button>
            </CardContent>
          </Card>

          {/* Minhas Viagens - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Viagens
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Planeje e registre viagens com IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Próxima viagem</span>
                  <Badge variant="secondary">Em 15 dias</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Orçamento</span>
                  <Badge variant="default">R$ 3.200</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Planejar
              </Button>
            </CardContent>
          </Card>

          {/* Compras e Mercado - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Compras
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Listas de compras inteligentes com IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Lista atual</span>
                  <Badge variant="secondary">12 itens</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Orçamento</span>
                  <Badge variant="outline">R$ 280</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Ver Lista
              </Button>
            </CardContent>
          </Card>

          {/* Pessoal - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Pessoal
                <Badge variant="outline" className="text-xs">
                  IA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Documentos, contatos, saúde com IA</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Documentos</span>
                  <Badge variant="outline">Organizados</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Contatos</span>
                  <Badge variant="secondary">156</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Acessar
              </Button>
            </CardContent>
          </Card>

          {/* Núcleo - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-primary/20 col-span-1 sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Núcleo IA
                <Badge variant="default" className="text-xs">
                  Central
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Assistente pessoal inteligente</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Produtividade</span>
                  <Badge variant="default">87%</Badge>
                </div>
                <Progress value={87} className="h-2" />
                <p className="text-xs text-center">3 sugestões pendentes</p>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm" variant="default">
                <Zap className="h-3 w-3 mr-1" />
                Dashboard IA
              </Button>
            </CardContent>
          </Card>

          {/* Mobile - Enhanced */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                PWA Mobile
                <Badge variant="secondary" className="text-xs">
                  Otimizado
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">App nativo com sincronização</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Offline</span>
                  <Badge variant="default">✓ Ativo</Badge>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span>Notificações</span>
                  <Badge variant="secondary">Habilitadas</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 text-xs sm:text-sm">
                Instalar App
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Stats Footer */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-primary">47</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Tarefas concluídas</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-primary">12</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Hábitos mantidos</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-primary">87%</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Produtividade IA</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-primary">23</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Dias de sequência</p>
            </CardContent>
          </Card>
        </div>

        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <Button
            size="lg"
            className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
