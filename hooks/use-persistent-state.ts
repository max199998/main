"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { LocalStorage } from "@/lib/storage"

export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  autoSave = true,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Initialize state with localStorage value or default
  const [state, setState] = useState<T>(() => {
    return LocalStorage.get(key, defaultValue)
  })

  // Save to localStorage whenever state changes (if autoSave is enabled)
  useEffect(() => {
    if (autoSave) {
      LocalStorage.set(key, state)
    }
  }, [key, state, autoSave])

  return [state, setState]
}

export function usePersistentArray<T>(
  key: string,
  defaultValue: T[] = [],
): [
  T[],
  (items: T[]) => void,
  (item: T) => void,
  (id: string | number, updater: (item: T) => T) => void,
  (id: string | number) => void,
] {
  const [items, setItems] = usePersistentState<T[]>(key, defaultValue)

  const setAllItems = (newItems: T[]) => {
    setItems(newItems)
  }

  const addItem = (item: T) => {
    setItems((prev) => [...prev, item])
  }

  const updateItem = (id: string | number, updater: (item: T) => T) => {
    setItems((prev) =>
      prev.map((item) => {
        const itemId = (item as any).id
        return itemId === id ? updater(item) : item
      }),
    )
  }

  const removeItem = (id: string | number) => {
    setItems((prev) => prev.filter((item) => (item as any).id !== id))
  }

  return [items, setAllItems, addItem, updateItem, removeItem]
}
