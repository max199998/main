"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare, Plus, Calendar, User, GraduationCap, Briefcase } from "lucide-react"
import { usePersistentArray } from "@/hooks/use-persistent-state"
import { STORAGE_KEYS } from "@/lib/storage"
import { syncManager } from "@/lib/sync-manager"

interface Task {
  id: string
  title: string
  description: string
  context: "Trabalho" | "Faculdade" | "Pessoal"
  priority: "Alta" | "Média" | "Baixa"
  status: "A Fazer" | "Em Andamento" | "Revisão" | "Concluído"
  dueDate: string
  subject?: string
  type: string
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Finalizar relatório mensal",
    description: "Compilar dados de vendas e criar apresentação",
    context: "Trabalho",
    priority: "Alta",
    status: "Em Andamento",
    dueDate: "2025-01-22",
    type: "Projeto",
  },
  {
    id: "2",
    title: "Estudar para prova de Cálculo",
    description: "Revisar capítulos 5-8 e resolver exercícios",
    context: "Faculdade",
    priority: "Alta",
    status: "A Fazer",
    dueDate: "2025-01-25",
    subject: "Matemática",
    type: "Prova",
  },
  {
    id: "3",
    title: "Agendar consulta médica",
    description: "Marcar check-up anual",
    context: "Pessoal",
    priority: "Média",
    status: "A Fazer",
    dueDate: "2025-01-30",
    type: "Saúde",
  },
  {
    id: "4",
    title: "Preparar apresentação do projeto",
    description: "Slides para reunião com cliente",
    context: "Trabalho",
    priority: "Alta",
    status: "Revisão",
    dueDate: "2025-01-24",
    type: "Reunião",
  },
  {
    id: "5",
    title: "Entregar trabalho de História",
    description: "Ensaio sobre Revolução Industrial",
    context: "Faculdade",
    priority: "Média",
    status: "Concluído",
    dueDate: "2025-01-20",
    subject: "História",
    type: "Trabalho",
  },
]

const priorityColors = {
  Alta: "destructive",
  Média: "secondary",
  Baixa: "outline",
} as const

const statusColors = {
  "A Fazer": "outline",
  "Em Andamento": "secondary",
  Revisão: "default",
  Concluído: "default",
} as const

const contextIcons = {
  Trabalho: Briefcase,
  Faculdade: GraduationCap,
  Pessoal: User,
}

export default function TaskManagement() {
  const [tasks, setTasks, addTask, updateTask, removeTask] = usePersistentArray<Task>(STORAGE_KEYS.TASKS, initialTasks)

  const [activeTab, setActiveTab] = useState("overview")
  const [newTask, setNewTask] = useState<Partial<Task>>({
    context: "Pessoal",
    priority: "Média",
    status: "A Fazer",
    type: "Tarefa",
  })

  const handleAddTask = () => {
    if (newTask.title) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description || "",
        context: newTask.context as Task["context"],
        priority: newTask.priority as Task["priority"],
        status: newTask.status as Task["status"],
        dueDate: newTask.dueDate || "",
        subject: newTask.subject,
        type: newTask.type || "Tarefa",
      }
      addTask(task)

      syncManager.emit("task_created", {
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        context: task.context,
        status: task.status,
      })

      setNewTask({
        context: "Pessoal",
        priority: "Média",
        status: "A Fazer",
        type: "Tarefa",
      })
    }
  }

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const oldStatus = task.status
    updateTask(taskId, (task) => ({ ...task, status: newStatus }))

    if (newStatus === "Concluído" && oldStatus !== "Concluído") {
      syncManager.emit("task_completed", {
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        context: task.context,
        status: newStatus,
      })
    } else {
      syncManager.emit("task_updated", {
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        context: task.context,
        status: newStatus,
      })
    }
  }

  const getTasksByContext = (context: Task["context"]) =>
    tasks.filter((task) => task.context === context && task.status !== "Concluído")

  const getTodayTasks = () => {
    const today = new Date().toISOString().split("T")[0]
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    return tasks.filter((task) => task.dueDate >= today && task.dueDate <= nextWeek && task.status !== "Concluído")
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const ContextIcon = contextIcons[task.context]

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <ContextIcon className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-sm">{task.title}</h4>
            </div>
            <Badge variant={priorityColors[task.priority]} className="text-xs">
              {task.priority}
            </Badge>
          </div>

          {task.description && <p className="text-xs text-muted-foreground mb-2">{task.description}</p>}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                </div>
              )}
              {task.subject && (
                <Badge variant="outline" className="text-xs">
                  {task.subject}
                </Badge>
              )}
            </div>

            <Select value={task.status} onValueChange={(value) => updateTaskStatus(task.id, value as Task["status"])}>
              <SelectTrigger className="w-32 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A Fazer">A Fazer</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Revisão">Revisão</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            Gestão de Tarefas Integrada
            <Badge variant="outline" className="text-xs ml-2">
              Auto-sync
            </Badge>
          </h2>
          <p className="text-muted-foreground">Gerencie tarefas de trabalho, faculdade e vida pessoal</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Título da tarefa"
                value={newTask.title || ""}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />

              <Textarea
                placeholder="Descrição (opcional)"
                value={newTask.description || ""}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={newTask.context}
                  onValueChange={(value) => setNewTask({ ...newTask, context: value as Task["context"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Contexto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trabalho">Trabalho</SelectItem>
                    <SelectItem value="Faculdade">Faculdade</SelectItem>
                    <SelectItem value="Pessoal">Pessoal</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task["priority"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input
                type="date"
                value={newTask.dueDate || ""}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />

              {newTask.context === "Faculdade" && (
                <Input
                  placeholder="Matéria/Disciplina"
                  value={newTask.subject || ""}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                />
              )}

              <Input
                placeholder="Tipo de tarefa"
                value={newTask.type || ""}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
              />

              <Button onClick={handleAddTask} className="w-full">
                Adicionar Tarefa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="work">Trabalho</TabsTrigger>
          <TabsTrigger value="college">Faculdade</TabsTrigger>
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {tasks.filter((t) => t.status !== "Concluído").length}
                </div>
                <p className="text-sm text-muted-foreground">Tarefas Pendentes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {tasks.filter((t) => t.status === "Em Andamento").length}
                </div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {tasks.filter((t) => t.status === "Concluído").length}
                </div>
                <p className="text-sm text-muted-foreground">Concluídas</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximas 7 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTodayTasks().map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {getTodayTasks().length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma tarefa nos próximos 7 dias</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Tarefas do Trabalho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTasksByContext("Trabalho").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {getTasksByContext("Trabalho").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma tarefa de trabalho pendente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="college" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Tarefas da Faculdade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTasksByContext("Faculdade").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {getTasksByContext("Faculdade").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma tarefa da faculdade pendente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Tarefas Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTasksByContext("Pessoal").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {getTasksByContext("Pessoal").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma tarefa pessoal pendente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(["A Fazer", "Em Andamento", "Revisão", "Concluído"] as const).map((status) => (
              <Card key={status}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {status}
                    <Badge variant="outline">{tasks.filter((t) => t.status === status).length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tasks
                    .filter((t) => t.status === status)
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
