"use client"

import React from "react"

// Generic storage utility for localStorage persistence
export class LocalStorage {
  static get<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") return

    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  static clear(): void {
    if (typeof window === "undefined") return

    try {
      window.localStorage.clear()
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }
  }
}

// Storage keys constants
export const STORAGE_KEYS = {
  TASKS: "productivity_tasks",
  EVENTS: "productivity_events",
  TRANSACTIONS: "productivity_transactions",
  ACCOUNTS: "productivity_accounts",
  STUDY_SESSIONS: "productivity_study_sessions",
  BOOKS: "productivity_books",
  SUBJECTS: "productivity_subjects",
  SETTINGS: "productivity_settings",
  HABITS: "productivity_habits",
  NOTES: "productivity_notes",
} as const

// Auto-save hook for components
export function useAutoSave<T>(key: string, data: T, delay = 1000) {
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      LocalStorage.set(key, data)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [key, data, delay])
}

// Data export/import utilities
export const DataManager = {
  exportAll(): string {
    const data = {
      tasks: LocalStorage.get(STORAGE_KEYS.TASKS, []),
      events: LocalStorage.get(STORAGE_KEYS.EVENTS, []),
      transactions: LocalStorage.get(STORAGE_KEYS.TRANSACTIONS, []),
      accounts: LocalStorage.get(STORAGE_KEYS.ACCOUNTS, []),
      studySessions: LocalStorage.get(STORAGE_KEYS.STUDY_SESSIONS, []),
      books: LocalStorage.get(STORAGE_KEYS.BOOKS, []),
      subjects: LocalStorage.get(STORAGE_KEYS.SUBJECTS, []),
      settings: LocalStorage.get(STORAGE_KEYS.SETTINGS, {}),
      habits: LocalStorage.get(STORAGE_KEYS.HABITS, []),
      notes: LocalStorage.get(STORAGE_KEYS.NOTES, []),
      exportDate: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  },

  importAll(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)

      if (data.tasks) LocalStorage.set(STORAGE_KEYS.TASKS, data.tasks)
      if (data.events) LocalStorage.set(STORAGE_KEYS.EVENTS, data.events)
      if (data.transactions) LocalStorage.set(STORAGE_KEYS.TRANSACTIONS, data.transactions)
      if (data.accounts) LocalStorage.set(STORAGE_KEYS.ACCOUNTS, data.accounts)
      if (data.studySessions) LocalStorage.set(STORAGE_KEYS.STUDY_SESSIONS, data.studySessions)
      if (data.books) LocalStorage.set(STORAGE_KEYS.BOOKS, data.books)
      if (data.subjects) LocalStorage.set(STORAGE_KEYS.SUBJECTS, data.subjects)
      if (data.settings) LocalStorage.set(STORAGE_KEYS.SETTINGS, data.settings)
      if (data.habits) LocalStorage.set(STORAGE_KEYS.HABITS, data.habits)
      if (data.notes) LocalStorage.set(STORAGE_KEYS.NOTES, data.notes)

      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  },

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      LocalStorage.remove(key)
    })
  },
}
