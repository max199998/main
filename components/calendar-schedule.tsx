"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  Coffee,
  Briefcase,
  GraduationCap,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"
import { usePersistentArray } from "@/hooks/use-persistent-state"
import { STORAGE_KEYS } from "@/lib/storage"
import { getAllHolidays2025, getHolidayByDate, type Holiday } from "@/lib/holidays"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "Reunião" | "Consulta" | "Prazo" | "Evento Pessoal" | "Estudo" | "Exercício"
  status: "Agendado" | "Concluído" | "Cancelado"
  location?: string
  duration: number // em minutos
}

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Reunião de equipe",
    description: "Revisão semanal do projeto",
    date: "2025-01-22",
    time: "09:00",
    type: "Reunião",
    status: "Agendado",
    location: "Sala de conferências",
    duration: 60,
  },
  {
    id: "2",
    title: "Consulta médica",
    description: "Check-up anual",
    date: "2025-01-23",
    time: "14:30",
    type: "Consulta",
    status: "Agendado",
    location: "Clínica São Paulo",
    duration: 30,
  },
  {
    id: "3",
    title: "Entrega do projeto",
    description: "Deadline final do projeto X",
    date: "2025-01-24",
    time: "18:00",
    type: "Prazo",
    status: "Agendado",
    duration: 0,
  },
  {
    id: "4",
    title: "Aula de Cálculo",
    description: "Derivadas e integrais",
    date: "2025-01-22",
    time: "19:00",
    type: "Estudo",
    status: "Agendado",
    location: "Universidade - Sala 201",
    duration: 120,
  },
  {
    id: "5",
    title: "Treino na academia",
    description: "Treino de pernas",
    date: "2025-01-22",
    time: "07:00",
    type: "Exercício",
    status: "Concluído",
    location: "Smart Fit",
    duration: 90,
  },
]

const eventTypeColors = {
  Reunião: "default",
  Consulta: "secondary",
  Prazo: "destructive",
  "Evento Pessoal": "outline",
  Estudo: "default",
  Exercício: "secondary",
} as const

const eventTypeIcons = {
  Reunião: Users,
  Consulta: Heart,
  Prazo: Clock,
  "Evento Pessoal": Coffee,
  Estudo: GraduationCap,
  Exercício: Briefcase,
}

export default function CalendarSchedule() {
  const [events, setEvents, addEvent, updateEvent, removeEvent] = usePersistentArray<Event>(
    STORAGE_KEYS.EVENTS,
    initialEvents,
  )

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: "Evento Pessoal",
    status: "Agendado",
    duration: 60,
  })
  const [holidays, setHolidays] = useState<Holiday[]>([])

  useEffect(() => {
    setHolidays(getAllHolidays2025())
  }, [])

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description || "",
        date: newEvent.date,
        time: newEvent.time,
        type: newEvent.type as Event["type"],
        status: newEvent.status as Event["status"],
        location: newEvent.location,
        duration: newEvent.duration || 60,
      }
      addEvent(event)
      setNewEvent({
        type: "Evento Pessoal",
        status: "Agendado",
        duration: 60,
      })
    }
  }

  const updateEventStatus = (eventId: string, newStatus: Event["status"]) => {
    updateEvent(eventId, (event) => ({ ...event, status: newStatus }))
  }

  const getEventsForDate = (date: string) => events.filter((event) => event.date === date)

  const getTodayEvents = () => {
    const today = new Date().toISOString().split("T")[0]
    return events.filter((event) => event.date === today)
  }

  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split("T")[0]
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    return events
      .filter((event) => event.date >= today && event.date <= nextWeek && event.status === "Agendado")
      .sort((a, b) => {
        if (a.date === b.date) {
          return a.time.localeCompare(b.time)
        }
        return a.date.localeCompare(b.date)
      })
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split("T")[0]
      const dayEvents = getEventsForDate(dateStr)
      const holiday = getHolidayByDate(dateStr)
      const isCurrentMonth = current.getMonth() === month
      const isToday = dateStr === new Date().toISOString().split("T")[0]

      days.push({
        date: new Date(current),
        dateStr,
        dayEvents,
        holiday,
        isCurrentMonth,
        isToday,
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const EventCard = ({ event }: { event: Event }) => {
    const EventIcon = eventTypeIcons[event.type]

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <EventIcon className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-sm">{event.title}</h4>
            </div>
            <Badge variant={eventTypeColors[event.type]} className="text-xs">
              {event.type}
            </Badge>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {event.time} {event.duration > 0 && `(${event.duration}min)`}
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </div>
            )}
          </div>

          {event.description && <p className="text-xs text-muted-foreground mt-2">{event.description}</p>}

          <div className="flex items-center justify-between mt-3">
            <Badge variant={event.status === "Concluído" ? "default" : "outline"} className="text-xs">
              {event.status}
            </Badge>

            {event.status === "Agendado" && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs bg-transparent"
                  onClick={() => updateEventStatus(event.id, "Concluído")}
                >
                  Concluir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs bg-transparent"
                  onClick={() => updateEventStatus(event.id, "Cancelado")}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Agenda
            <Badge variant="outline" className="text-xs ml-2">
              Auto-save + Feriados
            </Badge>
          </h2>
          <p className="text-muted-foreground">Organize seus compromissos, eventos e prazos</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Título do evento"
                value={newEvent.title || ""}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />

              <Textarea
                placeholder="Descrição (opcional)"
                value={newEvent.description || ""}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={newEvent.date || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />

                <Input
                  type="time"
                  value={newEvent.time || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value as Event["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reunião">Reunião</SelectItem>
                    <SelectItem value="Consulta">Consulta</SelectItem>
                    <SelectItem value="Prazo">Prazo</SelectItem>
                    <SelectItem value="Evento Pessoal">Evento Pessoal</SelectItem>
                    <SelectItem value="Estudo">Estudo</SelectItem>
                    <SelectItem value="Exercício">Exercício</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Duração (min)"
                  value={newEvent.duration || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, duration: Number.parseInt(e.target.value) || 0 })}
                />
              </div>

              <Input
                placeholder="Local (opcional)"
                value={newEvent.location || ""}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />

              <Button onClick={handleAddEvent} className="w-full">
                Adicionar Evento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="holidays">Feriados</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Hoje
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      p-2 min-h-[80px] border rounded-md cursor-pointer hover:bg-muted/50 transition-colors relative
                      ${!day.isCurrentMonth ? "text-muted-foreground bg-muted/20" : ""}
                      ${day.isToday ? "bg-primary/10 border-primary" : ""}
                      ${selectedDate === day.dateStr ? "bg-primary/20" : ""}
                      ${day.holiday ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800" : ""}
                    `}
                    onClick={() => setSelectedDate(selectedDate === day.dateStr ? "" : day.dateStr)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">{day.date.getDate()}</div>
                      {day.holiday && <Star className="h-3 w-3 text-yellow-600" />}
                    </div>

                    {day.holiday && (
                      <div className="text-xs text-yellow-700 dark:text-yellow-300 mb-1 truncate">
                        {day.holiday.name}
                      </div>
                    )}

                    <div className="space-y-1">
                      {day.dayEvents.slice(0, day.holiday ? 1 : 2).map((event) => (
                        <div key={event.id} className="text-xs p-1 rounded bg-primary/20 text-primary truncate">
                          {event.time} {event.title}
                        </div>
                      ))}
                      {day.dayEvents.length > (day.holiday ? 1 : 2) && (
                        <div className="text-xs text-muted-foreground">
                          +{day.dayEvents.length - (day.holiday ? 1 : 2)} mais
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedDate && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">
                    Eventos de {new Date(selectedDate).toLocaleDateString("pt-BR")}
                    {getHolidayByDate(selectedDate) && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        {getHolidayByDate(selectedDate)?.name}
                      </Badge>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {getEventsForDate(selectedDate).map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                    {getEventsForDate(selectedDate).length === 0 && (
                      <p className="text-center text-muted-foreground py-4">Nenhum evento neste dia</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTodayEvents().map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
                {getTodayEvents().length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum evento hoje</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximos 7 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getUpcomingEvents().map((event) => (
                  <div key={event.id} className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </div>
                    <EventCard event={event} />
                  </div>
                ))}
                {getUpcomingEvents().length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum evento nos próximos 7 dias</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holidays" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Feriados e Datas Comemorativas 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {holidays.map((holiday) => (
                  <Card key={holiday.date} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{holiday.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(holiday.date).toLocaleDateString("pt-BR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </p>
                        </div>
                        <Badge
                          variant={
                            holiday.type === "national"
                              ? "default"
                              : holiday.type === "religious"
                                ? "secondary"
                                : holiday.type === "commemorative"
                                  ? "outline"
                                  : "secondary"
                          }
                          className="text-xs"
                        >
                          {holiday.type === "national"
                            ? "Nacional"
                            : holiday.type === "religious"
                              ? "Religioso"
                              : holiday.type === "commemorative"
                                ? "Comemorativo"
                                : "Regional"}
                        </Badge>
                      </div>
                      {holiday.description && <p className="text-xs text-muted-foreground">{holiday.description}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {events.filter((e) => e.status === "Agendado").length}
                </div>
                <p className="text-sm text-muted-foreground">Agendados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {events.filter((e) => e.status === "Concluído").length}
                </div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {events.filter((e) => e.status === "Cancelado").length}
                </div>
                <p className="text-sm text-muted-foreground">Cancelados</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Todos os Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .sort((a, b) => {
                    if (a.date === b.date) {
                      return a.time.localeCompare(b.time)
                    }
                    return b.date.localeCompare(a.date)
                  })
                  .map((event) => (
                    <div key={event.id} className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("pt-BR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <EventCard event={event} />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
