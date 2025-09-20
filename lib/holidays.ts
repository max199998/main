// Sistema de feriados brasi```tsx file="lib/holidays.ts"
"use client"

import React from "react"

export interface Holiday {
  date: string
  name: string
  type: "national" | "regional" | "religious" | "commemorative"
  description?: string
}

// Feriados nacionais fixos para 2025
const FIXED_HOLIDAYS_2025: Holiday[] = [
  {
    date: "2025-01-01",
    name: "Confraternização Universal",
    type: "national",
    description: "Ano Novo",
  },
  {
    date: "2025-04-21",
    name: "Tiradentes",
    type: "national",
    description: "Dia de Tiradentes",
  },
  {
    date: "2025-05-01",
    name: "Dia do Trabalhador",
    type: "national",
    description: "Dia do Trabalho",
  },
  {
    date: "2025-09-07",
    name: "Independência do Brasil",
    type: "national",
    description: "Dia da Independência",
  },
  {
    date: "2025-10-12",
    name: "Nossa Senhora Aparecida",
    type: "national",
    description: "Padroeira do Brasil",
  },
  {
    date: "2025-11-02",
    name: "Finados",
    type: "national",
    description: "Dia de Finados",
  },
  {
    date: "2025-11-15",
    name: "Proclamação da República",
    type: "national",
    description: "Proclamação da República",
  },
  {
    date: "2025-11-20",
    name: "Consciência Negra",
    type: "national",
    description: "Dia da Consciência Negra",
  },
  {
    date: "2025-12-25",
    name: "Natal",
    type: "national",
    description: "Nascimento de Jesus Cristo",
  },
]

// Função para calcular a Páscoa (algoritmo de Gauss)
function calculateEaster(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1

  return new Date(year, month - 1, day)
}

// Feriados móveis baseados na Páscoa para 2025
function getMovableHolidays2025(): Holiday[] {
  const easter = calculateEaster(2025)
  const holidays: Holiday[] = []

  // Carnaval (47 dias antes da Páscoa)
  const carnival = new Date(easter)
  carnival.setDate(carnival.getDate() - 47)
  holidays.push({
    date: carnival.toISOString().split("T")[0],
    name: "Carnaval",
    type: "national",
    description: "Terça-feira de Carnaval",
  })

  // Sexta-feira Santa (2 dias antes da Páscoa)
  const goodFriday = new Date(easter)
  goodFriday.setDate(goodFriday.getDate() - 2)
  holidays.push({
    date: goodFriday.toISOString().split("T")[0],
    name: "Sexta-feira Santa",
    type: "national",
    description: "Paixão de Cristo",
  })

  // Corpus Christi (60 dias após a Páscoa)
  const corpusChristi = new Date(easter)
  corpusChristi.setDate(corpusChristi.getDate() + 60)
  holidays.push({
    date: corpusChristi.toISOString().split("T")[0],
    name: "Corpus Christi",
    type: "national",
    description: "Corpo de Cristo",
  })

  return holidays
}

// Datas comemorativas importantes (não feriados oficiais)
const COMMEMORATIVE_DATES_2025: Holiday[] = [
  {
    date: "2025-02-14",
    name: "Dia dos Namorados",
    type: "commemorative",
    description: "Dia de São Valentim",
  },
  {
    date: "2025-03-08",
    name: "Dia Internacional da Mulher",
    type: "commemorative",
    description: "Dia da Mulher",
  },
  {
    date: "2025-05-11",
    name: "Dia das Mães",
    type: "commemorative",
    description: "Segundo domingo de maio",
  },
  {
    date: "2025-06-12",
    name: "Dia dos Namorados",
    type: "commemorative",
    description: "Dia dos Namorados no Brasil",
  },
  {
    date: "2025-08-10",
    name: "Dia dos Pais",
    type: "commemorative",
    description: "Segundo domingo de agosto",
  },
  {
    date: "2025-10-12",
    name: "Dia das Crianças",
    type: "commemorative",
    description: "Dia das Crianças",
  },
  {
    date: "2025-10-31",
    name: "Halloween",
    type: "commemorative",
    description: "Dia das Bruxas",
  },
]

// Cache para armazenar feriados
let holidaysCache: Holiday[] | null = null

export function getAllHolidays2025(): Holiday[] {
  if (holidaysCache) {
    return holidaysCache
  }

  const allHolidays = [...FIXED_HOLIDAYS_2025, ...getMovableHolidays2025(), ...COMMEMORATIVE_DATES_2025].sort((a, b) =>
    a.date.localeCompare(b.date),
  )

  holidaysCache = allHolidays
  return allHolidays
}

export function getHolidayByDate(date: string): Holiday | null {
  const holidays = getAllHolidays2025()
  return holidays.find((holiday) => holiday.date === date) || null
}

export function getHolidaysInMonth(year: number, month: number): Holiday[] {
  const holidays = getAllHolidays2025()
  const monthStr = month.toString().padStart(2, "0")
  return holidays.filter((holiday) => holiday.date.startsWith(`${year}-${monthStr}`))
}

export function isHoliday(date: string): boolean {
  return getHolidayByDate(date) !== null
}

export function getNextHolidays(count = 5): Holiday[] {
  const today = new Date().toISOString().split("T")[0]
  const holidays = getAllHolidays2025()

  return holidays.filter((holiday) => holiday.date >= today).slice(0, count)
}

export function getHolidaysByType(type: Holiday["type"]): Holiday[] {
  const holidays = getAllHolidays2025()
  return holidays.filter((holiday) => holiday.type === type)
}

// Função para calcular dias úteis entre duas datas
export function getBusinessDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const holidays = getAllHolidays2025()
  const holidayDates = new Set(holidays.map((h) => h.date))

  let businessDays = 0
  const current = new Date(start)

  while (current <= end) {
    const dayOfWeek = current.getDay()
    const dateStr = current.toISOString().split("T")[0]

    // Se não é fim de semana (0 = domingo, 6 = sábado) e não é feriado
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.has(dateStr)) {
      businessDays++
    }

    current.setDate(current.getDate() + 1)
  }

  return businessDays
}

// Hook para usar feriados em componentes React
export function useHolidays() {
  const [holidays, setHolidays] = React.useState<Holiday[]>([])

  React.useEffect(() => {
    setHolidays(getAllHolidays2025())
  }, [])

  return {
    holidays,
    getHolidayByDate,
    getHolidaysInMonth,
    isHoliday,
    getNextHolidays,
    getHolidaysByType,
    getBusinessDaysBetween,
  }
}
