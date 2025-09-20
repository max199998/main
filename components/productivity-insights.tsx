"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useSyncManager } from "@/lib/sync-manager"
import { TrendingUp, Target, Calendar, DollarSign, BookOpen, Zap, Lightbulb, Award } from "lucide-react"

export default function ProductivityInsights() {
  const { insights } = useSyncManager()

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Insights de Produtividade
            <Badge variant="outline" className="text-xs ml-2">
              IA Integrada
            </Badge>
          </h2>
          <p className="text-muted-foreground">Análise inteligente do seu desempenho e sugestões personalizadas</p>
        </div>
      </div>

      {/* Score Principal */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Score de Produtividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-primary">{insights.productivityScore}%</div>
            <Badge variant={getScoreVariant(insights.productivityScore)} className="text-sm">
              {insights.productivityScore >= 80
                ? "Excelente"
                : insights.productivityScore >= 60
                  ? "Bom"
                  : "Precisa Melhorar"}
            </Badge>
          </div>
          <Progress value={insights.productivityScore} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            Baseado na conclusão de tarefas, sequência de dias ativos e sessões de estudo
          </p>
        </CardContent>
      </Card>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
                <p className="text-2xl font-bold text-primary">
                  {insights.completedTasks}/{insights.totalTasks}
                </p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <Progress
                value={insights.totalTasks > 0 ? (insights.completedTasks / insights.totalTasks) * 100 : 0}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sequência de Dias</p>
                <p className="text-2xl font-bold text-primary">{insights.streakDays}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {insights.streakDays > 0 ? "Dias consecutivos ativos" : "Comece uma nova sequência!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eventos Hoje</p>
                <p className="text-2xl font-bold text-primary">{insights.todayEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {insights.todayEvents > 0 ? "Compromissos agendados" : "Agenda livre hoje"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transações (7d)</p>
                <p className="text-2xl font-bold text-primary">{insights.weeklyTransactions}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Movimentações financeiras</p>
          </CardContent>
        </Card>
      </div>

      {/* Sugestões Inteligentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Sugestões Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.suggestions.length > 0 ? (
            <div className="space-y-3">
              {insights.suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Continue usando o sistema para receber sugestões personalizadas!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Recomendadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Target className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Revisar Metas</div>
                <div className="text-xs text-muted-foreground">Ajustar objetivos semanais</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Calendar className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Planejar Semana</div>
                <div className="text-xs text-muted-foreground">Organizar próximos 7 dias</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <BookOpen className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Sessão de Estudo</div>
                <div className="text-xs text-muted-foreground">Iniciar Pomodoro</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
