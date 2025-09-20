"use client"

import React from "react"

import { LocalStorage, STORAGE_KEYS } from "./storage"
import { notificationManager } from "./notifications"
import { getHolidayByDate, isHoliday } from "./holidays"

export interface SyncEvent {
  id: string
  type:
    | "task_created"
    | "task_updated"
    | "task_completed"
    | "event_created"
    | "event_updated"
    | "transaction_added"
    | "study_session_completed"
  data: any
  timestamp: string
  processed: boolean
}

export interface TaskEvent {
  id: string
  title: string
  dueDate: string
  priority: "Alta" | "Média" | "Baixa"
  context: "Trabalho" | "Faculdade" | "Pessoal"
  status: "A Fazer" | "Em Andamento" | "Revisão" | "Concluído"
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  type: string
  status: "Agendado" | "Concluído" | "Cancelado"
}

export interface FinancialTransaction {
  id: string
  description: string
  amount: number
  type: "Receita" | "Despesa"
  category: string
  date: string
}

class SyncManager {
  private events: SyncEvent[] = []
  private listeners: Map<string, ((event: SyncEvent) => void)[]> = new Map()

  constructor() {
    this.loadEvents()
    this.startEventProcessor()
  }

  private loadEvents() {
    this.events = LocalStorage.get("productivity_sync_events", [])
  }

  private saveEvents() {
    LocalStorage.set("productivity_sync_events", this.events)
  }

  // Subscribe to specific event types
  subscribe(eventType: SyncEvent["type"], callback: (event: SyncEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)!.push(callback)

    return () => {
      const callbacks = this.listeners.get(eventType)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  // Emit events to trigger cross-module synchronization
  emit(type: SyncEvent["type"], data: any) {
    const event: SyncEvent = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      data,
      timestamp: new Date().toISOString(),
      processed: false,
    }

    this.events.unshift(event)

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(0, 1000)
    }

    this.saveEvents()
    this.processEvent(event)
  }

  private processEvent(event: SyncEvent) {
    // Notify subscribers
    const callbacks = this.listeners.get(event.type)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(event)
        } catch (error) {
          console.error("Error processing sync event:", error)
        }
      })
    }

    // Process built-in integrations
    this.processBuiltInIntegrations(event)

    event.processed = true
    this.saveEvents()
  }

  private processBuiltInIntegrations(event: SyncEvent) {
    switch (event.type) {
      case "task_created":
        this.handleTaskCreated(event.data as TaskEvent)
        break
      case "task_updated":
        this.handleTaskUpdated(event.data as TaskEvent)
        break
      case "task_completed":
        this.handleTaskCompleted(event.data as TaskEvent)
        break
      case "event_created":
        this.handleEventCreated(event.data as CalendarEvent)
        break
      case "transaction_added":
        this.handleTransactionAdded(event.data as FinancialTransaction)
        break
      case "study_session_completed":
        this.handleStudySessionCompleted(event.data)
        break
    }
  }

  private handleTaskCreated(task: TaskEvent) {
    // Auto-create calendar event for tasks with due dates
    if (task.dueDate && task.priority === "Alta") {
      const dueDate = new Date(task.dueDate)
      const reminderDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000) // 1 day before

      // Create calendar reminder
      const calendarEvent = {
        id: `task-reminder-${task.id}`,
        title: `Lembrete: ${task.title}`,
        date: reminderDate.toISOString().split("T")[0],
        time: "09:00",
        type: "Lembrete",
        status: "Agendado" as const,
        description: `Tarefa de ${task.context.toLowerCase()} vence amanhã`,
        duration: 15,
      }

      // Add to calendar events
      const existingEvents = LocalStorage.get(STORAGE_KEYS.EVENTS, [])
      const updatedEvents = [...existingEvents, calendarEvent]
      LocalStorage.set(STORAGE_KEYS.EVENTS, updatedEvents)

      // Schedule notification
      notificationManager.taskReminder(task.title, dueDate)
    }

    // Check if due date is a holiday
    if (task.dueDate && isHoliday(task.dueDate)) {
      const holiday = getHolidayByDate(task.dueDate)
      notificationManager.add({
        title: "Atenção: Prazo em Feriado",
        message: `A tarefa "${task.title}" vence em ${holiday?.name}. Considere ajustar o prazo.`,
        type: "warning",
        persistent: true,
      })
    }
  }

  private handleTaskUpdated(task: TaskEvent) {
    // Update related calendar events
    const events = LocalStorage.get(STORAGE_KEYS.EVENTS, [])
    const updatedEvents = events.map((event: any) => {
      if (event.id === `task-reminder-${task.id}`) {
        return {
          ...event,
          title: `Lembrete: ${task.title}`,
          date: task.dueDate
            ? new Date(new Date(task.dueDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            : event.date,
        }
      }
      return event
    })
    LocalStorage.set(STORAGE_KEYS.EVENTS, updatedEvents)
  }

  private handleTaskCompleted(task: TaskEvent) {
    // Remove related calendar reminders
    const events = LocalStorage.get(STORAGE_KEYS.EVENTS, [])
    const filteredEvents = events.filter((event: any) => event.id !== `task-reminder-${task.id}`)
    LocalStorage.set(STORAGE_KEYS.EVENTS, filteredEvents)

    // Add completion notification
    notificationManager.add({
      title: "Tarefa Concluída!",
      message: `"${task.title}" foi marcada como concluída.`,
      type: "success",
    })

    // Update productivity stats
    this.updateProductivityStats("task_completed", task.context)
  }

  private handleEventCreated(event: CalendarEvent) {
    // Check for conflicts with existing events
    const existingEvents = LocalStorage.get(STORAGE_KEYS.EVENTS, [])
    const conflicts = existingEvents.filter(
      (existing: any) =>
        existing.date === event.date &&
        existing.id !== event.id &&
        existing.status === "Agendado" &&
        this.hasTimeConflict(existing.time, event.time),
    )

    if (conflicts.length > 0) {
      notificationManager.add({
        title: "Conflito de Agenda Detectado",
        message: `O evento "${event.title}" conflita com ${conflicts.length} evento(s) existente(s).`,
        type: "warning",
        persistent: true,
        actionUrl: "/calendar",
      })
    }

    // Schedule reminder notification
    const eventDateTime = new Date(`${event.date}T${event.time}`)
    notificationManager.eventReminder(event.title, eventDateTime)
  }

  private handleTransactionAdded(transaction: FinancialTransaction) {
    // Check for unusual spending patterns
    const transactions = LocalStorage.get(STORAGE_KEYS.TRANSACTIONS, [])
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthlyExpenses = transactions
      .filter((t: any) => {
        const tDate = new Date(t.date)
        return t.type === "Despesa" && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear
      })
      .reduce((total: number, t: any) => total + t.amount, 0)

    // Alert if monthly expenses exceed threshold
    if (transaction.type === "Despesa" && monthlyExpenses > 3000) {
      notificationManager.financialAlert(
        `Gastos mensais atingiram R$ ${monthlyExpenses.toFixed(2)}. Considere revisar seu orçamento.`,
        "warning",
      )
    }

    // Alert for large transactions
    if (Math.abs(transaction.amount) > 1000) {
      notificationManager.add({
        title: transaction.type === "Receita" ? "Grande Receita Registrada" : "Grande Despesa Registrada",
        message: `${transaction.type}: ${transaction.description} - R$ ${Math.abs(transaction.amount).toFixed(2)}`,
        type: transaction.type === "Receita" ? "success" : "warning",
        actionUrl: "/finances",
      })
    }
  }

  private handleStudySessionCompleted(sessionData: any) {
    // Update study streaks and stats
    notificationManager.add({
      title: "Sessão de Estudo Concluída!",
      message: `Você estudou ${sessionData.subject} por ${sessionData.duration} minutos.`,
      type: "success",
    })

    this.updateProductivityStats("study_completed", sessionData.subject)
  }

  private hasTimeConflict(time1: string, time2: string): boolean {
    const [h1, m1] = time1.split(":").map(Number)
    const [h2, m2] = time2.split(":").map(Number)

    const minutes1 = h1 * 60 + m1
    const minutes2 = h2 * 60 + m2

    // Consider conflict if events are within 30 minutes of each other
    return Math.abs(minutes1 - minutes2) < 30
  }

  private updateProductivityStats(action: string, context: string) {
    const stats = LocalStorage.get("productivity_stats", {
      tasksCompleted: 0,
      studySessions: 0,
      streakDays: 0,
      lastActivity: null,
      contextStats: {},
    })

    const today = new Date().toISOString().split("T")[0]

    if (action === "task_completed") {
      stats.tasksCompleted += 1
      stats.contextStats[context] = (stats.contextStats[context] || 0) + 1
    } else if (action === "study_completed") {
      stats.studySessions += 1
    }

    // Update streak
    if (stats.lastActivity !== today) {
      const lastDate = stats.lastActivity ? new Date(stats.lastActivity) : null
      const todayDate = new Date(today)

      if (lastDate && todayDate.getTime() - lastDate.getTime() === 24 * 60 * 60 * 1000) {
        stats.streakDays += 1
      } else if (!lastDate || todayDate.getTime() - lastDate.getTime() > 24 * 60 * 60 * 1000) {
        stats.streakDays = 1
      }

      stats.lastActivity = today
    }

    LocalStorage.set("productivity_stats", stats)
  }

  // Start background processor for scheduled events
  private startEventProcessor() {
    setInterval(() => {
      const unprocessedEvents = this.events.filter((e) => !e.processed)
      unprocessedEvents.forEach((event) => {
        this.processEvent(event)
      })
    }, 30000) // Process every 30 seconds
  }

  // Get productivity insights
  getProductivityInsights() {
    const stats = LocalStorage.get("productivity_stats", {
      tasksCompleted: 0,
      studySessions: 0,
      streakDays: 0,
      contextStats: {},
    })

    const tasks = LocalStorage.get(STORAGE_KEYS.TASKS, [])
    const events = LocalStorage.get(STORAGE_KEYS.EVENTS, [])
    const transactions = LocalStorage.get(STORAGE_KEYS.TRANSACTIONS, [])

    const today = new Date().toISOString().split("T")[0]
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t: any) => t.status === "Concluído").length,
      todayEvents: events.filter((e: any) => e.date === today).length,
      weeklyTransactions: transactions.filter((t: any) => t.date >= thisWeek).length,
      streakDays: stats.streakDays,
      productivityScore: this.calculateProductivityScore(stats, tasks, events),
      suggestions: this.generateSuggestions(stats, tasks, events, transactions),
    }
  }

  private calculateProductivityScore(stats: any, tasks: any[], events: any[]): number {
    const completionRate =
      tasks.length > 0 ? (tasks.filter((t) => t.status === "Concluído").length / tasks.length) * 100 : 0
    const streakBonus = Math.min(stats.streakDays * 2, 20)
    const activityBonus = Math.min(stats.studySessions * 1.5, 15)

    return Math.min(Math.round(completionRate + streakBonus + activityBonus), 100)
  }

  private generateSuggestions(stats: any, tasks: any[], events: any[], transactions: any[]): string[] {
    const suggestions: string[] = []

    // Task-based suggestions
    const highPriorityTasks = tasks.filter((t) => t.priority === "Alta" && t.status !== "Concluído")
    if (highPriorityTasks.length > 3) {
      suggestions.push("Você tem muitas tarefas de alta prioridade. Considere focar nas 3 mais importantes.")
    }

    // Time management suggestions
    const today = new Date().toISOString().split("T")[0]
    const todayEvents = events.filter((e) => e.date === today && e.status === "Agendado")
    if (todayEvents.length > 5) {
      suggestions.push("Sua agenda está cheia hoje. Reserve tempo para pausas entre os compromissos.")
    }

    // Financial suggestions
    const thisMonth = new Date().getMonth()
    const monthlyExpenses = transactions
      .filter((t) => t.type === "Despesa" && new Date(t.date).getMonth() === thisMonth)
      .reduce((total, t) => total + t.amount, 0)

    if (monthlyExpenses > 2500) {
      suggestions.push("Seus gastos mensais estão altos. Revise suas categorias de despesas.")
    }

    // Streak suggestions
    if (stats.streakDays > 7) {
      suggestions.push(`Parabéns! Você mantém uma sequência de ${stats.streakDays} dias. Continue assim!`)
    } else if (stats.streakDays === 0) {
      suggestions.push("Que tal começar uma nova sequência de produtividade hoje?")
    }

    return suggestions.slice(0, 3) // Return max 3 suggestions
  }

  // Clear old events
  clearOldEvents(daysToKeep = 30) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
    this.events = this.events.filter((event) => new Date(event.timestamp) > cutoffDate)
    this.saveEvents()
  }
}

// Singleton instance
export const syncManager = new SyncManager()

// React hook for using sync manager
export function useSyncManager() {
  const [insights, setInsights] = React.useState(syncManager.getProductivityInsights())

  React.useEffect(() => {
    const updateInsights = () => setInsights(syncManager.getProductivityInsights())

    // Update insights when any sync event occurs
    const unsubscribers = [
      syncManager.subscribe("task_completed", updateInsights),
      syncManager.subscribe("event_created", updateInsights),
      syncManager.subscribe("transaction_added", updateInsights),
      syncManager.subscribe("study_session_completed", updateInsights),
    ]

    // Update insights every minute
    const interval = setInterval(updateInsights, 60000)

    return () => {
      unsubscribers.forEach((unsub) => unsub())
      clearInterval(interval)
    }
  }, [])

  return {
    insights,
    emit: (type: SyncEvent["type"], data: any) => syncManager.emit(type, data),
    subscribe: (type: SyncEvent["type"], callback: (event: SyncEvent) => void) => syncManager.subscribe(type, callback),
  }
}
