"use client"

import React from "react"

import { LocalStorage } from "./storage"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error" | "reminder"
  timestamp: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
  persistent?: boolean
  scheduledFor?: string
}

export interface NotificationSettings {
  enabled: boolean
  browserNotifications: boolean
  soundEnabled: boolean
  reminderMinutes: number[]
  taskReminders: boolean
  eventReminders: boolean
  studyReminders: boolean
  financialAlerts: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  browserNotifications: false,
  soundEnabled: true,
  reminderMinutes: [15, 60, 1440], // 15min, 1h, 1 day
  taskReminders: true,
  eventReminders: true,
  studyReminders: true,
  financialAlerts: true,
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00",
  },
}

class NotificationManager {
  private notifications: Notification[] = []
  private settings: NotificationSettings = DEFAULT_SETTINGS
  private listeners: ((notifications: Notification[]) => void)[] = []

  constructor() {
    this.loadFromStorage()
    this.requestBrowserPermission()
    this.startScheduledNotificationChecker()
  }

  private loadFromStorage() {
    this.notifications = LocalStorage.get("productivity_notifications", [])
    this.settings = { ...DEFAULT_SETTINGS, ...LocalStorage.get("productivity_notification_settings", {}) }
  }

  private saveToStorage() {
    LocalStorage.set("productivity_notifications", this.notifications)
    LocalStorage.set("productivity_notification_settings", this.settings)
    this.notifyListeners()
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.notifications))
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  async requestBrowserPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("Browser does not support notifications")
      return false
    }

    if (Notification.permission === "granted") {
      this.settings.browserNotifications = true
      this.saveToStorage()
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        this.settings.browserNotifications = true
        this.saveToStorage()
        return true
      }
    }

    return false
  }

  private isInQuietHours(): boolean {
    if (!this.settings.quietHours.enabled) return false

    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    const { start, end } = this.settings.quietHours

    if (start <= end) {
      return currentTime >= start && currentTime <= end
    } else {
      return currentTime >= start || currentTime <= end
    }
  }

  private playNotificationSound() {
    if (!this.settings.soundEnabled || this.isInQuietHours()) return

    // Create a simple notification sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn("Could not play notification sound:", error)
    }
  }

  add(notification: Omit<Notification, "id" | "timestamp" | "read">): string {
    if (!this.settings.enabled) return ""

    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    }

    this.notifications.unshift(newNotification)

    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100)
    }

    this.saveToStorage()

    // Show browser notification if enabled and not in quiet hours
    if (this.settings.browserNotifications && !this.isInQuietHours()) {
      this.showBrowserNotification(newNotification)
    }

    // Play sound
    this.playNotificationSound()

    return newNotification.id
  }

  private showBrowserNotification(notification: Notification) {
    if (!("Notification" in window) || Notification.permission !== "granted") return

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: notification.id,
      requireInteraction: notification.persistent,
      actions: notification.actionUrl ? [{ action: "view", title: notification.actionLabel || "Ver" }] : undefined,
    })

    browserNotification.onclick = () => {
      window.focus()
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl
      }
      browserNotification.close()
    }

    // Auto close after 5 seconds unless persistent
    if (!notification.persistent) {
      setTimeout(() => browserNotification.close(), 5000)
    }
  }

  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.saveToStorage()
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true))
    this.saveToStorage()
  }

  remove(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id)
    this.saveToStorage()
  }

  clear() {
    this.notifications = []
    this.saveToStorage()
  }

  getAll(): Notification[] {
    return [...this.notifications]
  }

  getUnread(): Notification[] {
    return this.notifications.filter((n) => !n.read)
  }

  getSettings(): NotificationSettings {
    return { ...this.settings }
  }

  updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings }
    this.saveToStorage()
  }

  // Schedule notifications for tasks and events
  scheduleReminder(
    title: string,
    message: string,
    scheduledFor: Date,
    type: Notification["type"] = "reminder",
    actionUrl?: string,
  ): string {
    const notification: Omit<Notification, "id" | "timestamp" | "read"> = {
      title,
      message,
      type,
      scheduledFor: scheduledFor.toISOString(),
      actionUrl,
      persistent: true,
    }

    return this.add(notification)
  }

  private startScheduledNotificationChecker() {
    setInterval(() => {
      const now = new Date()
      const scheduledNotifications = this.notifications.filter(
        (n) => n.scheduledFor && new Date(n.scheduledFor) <= now && !n.read,
      )

      scheduledNotifications.forEach((notification) => {
        // Re-trigger the notification
        this.add({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          actionUrl: notification.actionUrl,
          persistent: notification.persistent,
        })

        // Mark the scheduled one as read
        this.markAsRead(notification.id)
      })
    }, 60000) // Check every minute
  }

  // Utility methods for common notifications
  taskReminder(taskTitle: string, dueDate: Date) {
    if (!this.settings.taskReminders) return

    const now = new Date()
    this.settings.reminderMinutes.forEach((minutes) => {
      const reminderTime = new Date(dueDate.getTime() - minutes * 60 * 1000)
      if (reminderTime > now) {
        this.scheduleReminder(
          "Lembrete de Tarefa",
          `"${taskTitle}" vence em ${minutes < 60 ? minutes + " minutos" : minutes / 60 + " horas"}`,
          reminderTime,
          "reminder",
          "/tasks",
        )
      }
    })
  }

  eventReminder(eventTitle: string, eventDate: Date) {
    if (!this.settings.eventReminders) return

    const now = new Date()
    this.settings.reminderMinutes.forEach((minutes) => {
      const reminderTime = new Date(eventDate.getTime() - minutes * 60 * 1000)
      if (reminderTime > now) {
        this.scheduleReminder(
          "Lembrete de Evento",
          `"${eventTitle}" começa em ${minutes < 60 ? minutes + " minutos" : minutes / 60 + " horas"}`,
          reminderTime,
          "reminder",
          "/calendar",
        )
      }
    })
  }

  studyReminder(subject: string, sessionTime: Date) {
    if (!this.settings.studyReminders) return

    this.scheduleReminder(
      "Hora de Estudar",
      `Sessão de estudo de ${subject} agendada para agora`,
      sessionTime,
      "info",
      "/studies",
    )
  }

  financialAlert(message: string, type: "warning" | "error" = "warning") {
    if (!this.settings.financialAlerts) return

    this.add({
      title: "Alerta Financeiro",
      message,
      type,
      persistent: true,
      actionUrl: "/finances",
    })
  }
}

// Singleton instance
export const notificationManager = new NotificationManager()

// React hook for using notifications
export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  React.useEffect(() => {
    setNotifications(notificationManager.getAll())

    const unsubscribe = notificationManager.subscribe(setNotifications)
    return unsubscribe
  }, [])

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    add: (notification: Omit<Notification, "id" | "timestamp" | "read">) => notificationManager.add(notification),
    markAsRead: (id: string) => notificationManager.markAsRead(id),
    markAllAsRead: () => notificationManager.markAllAsRead(),
    remove: (id: string) => notificationManager.remove(id),
    clear: () => notificationManager.clear(),
    settings: notificationManager.getSettings(),
    updateSettings: (settings: Partial<NotificationSettings>) => notificationManager.updateSettings(settings),
    requestPermission: () => notificationManager.requestBrowserPermission(),
    scheduleReminder: (title: string, message: string, date: Date, type?: Notification["type"], url?: string) =>
      notificationManager.scheduleReminder(title, message, date, type, url),
    taskReminder: (title: string, date: Date) => notificationManager.taskReminder(title, date),
    eventReminder: (title: string, date: Date) => notificationManager.eventReminder(title, date),
    studyReminder: (subject: string, date: Date) => notificationManager.studyReminder(subject, date),
    financialAlert: (message: string, type?: "warning" | "error") => notificationManager.financialAlert(message, type),
  }
}
