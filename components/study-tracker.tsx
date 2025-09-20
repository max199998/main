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
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Target,
  Calendar,
  Star,
  BookMarked,
  Timer,
  TrendingUp,
} from "lucide-react"

interface Subject {
  id: string
  name: string
  color: string
  status: "Ativo" | "Pausado" | "Concluído"
  progress: number
  totalHours: number
  studiedHours: number
  deadline?: string
  description: string
}

interface StudySession {
  id: string
  subjectId: string
  subjectName: string
  duration: number // em minutos
  date: string
  notes: string
  type: "Leitura" | "Exercícios" | "Revisão" | "Prova" | "Projeto"
}

interface Book {
  id: string
  title: string
  author: string
  status: "A Ler" | "Lendo" | "Lido" | "Pausado"
  progress: number
  totalPages: number
  currentPage: number
  rating?: number
  notes: string
  genre: string
  startDate?: string
  finishDate?: string
}

const initialSubjects: Subject[] = [
  {
    id: "1",
    name: "Cálculo I",
    color: "bg-blue-500",
    status: "Ativo",
    progress: 75,
    totalHours: 80,
    studiedHours: 60,
    deadline: "2025-06-30",
    description: "Derivadas, integrais e aplicações",
  },
  {
    id: "2",
    name: "Programação Web",
    color: "bg-green-500",
    status: "Ativo",
    progress: 60,
    totalHours: 100,
    studiedHours: 60,
    deadline: "2025-07-15",
    description: "HTML, CSS, JavaScript e React",
  },
  {
    id: "3",
    name: "Inglês Avançado",
    color: "bg-purple-500",
    status: "Ativo",
    progress: 40,
    totalHours: 60,
    studiedHours: 24,
    description: "Conversação e gramática avançada",
  },
]

const initialSessions: StudySession[] = [
  {
    id: "1",
    subjectId: "1",
    subjectName: "Cálculo I",
    duration: 120,
    date: "2025-01-20",
    notes: "Estudei derivadas de funções compostas",
    type: "Leitura",
  },
  {
    id: "2",
    subjectId: "2",
    subjectName: "Programação Web",
    duration: 90,
    date: "2025-01-19",
    notes: "Prática com React hooks",
    type: "Exercícios",
  },
  {
    id: "3",
    subjectId: "1",
    subjectName: "Cálculo I",
    duration: 60,
    date: "2025-01-18",
    notes: "Resolvi exercícios do capítulo 5",
    type: "Exercícios",
  },
]

const initialBooks: Book[] = [
  {
    id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    status: "Lendo",
    progress: 65,
    totalPages: 464,
    currentPage: 302,
    rating: 5,
    notes: "Excelente livro sobre boas práticas de programação",
    genre: "Tecnologia",
    startDate: "2025-01-01",
  },
  {
    id: "2",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    status: "Lido",
    progress: 100,
    totalPages: 512,
    currentPage: 512,
    rating: 4,
    notes: "Perspectiva interessante sobre a história da humanidade",
    genre: "História",
    startDate: "2024-12-01",
    finishDate: "2025-01-10",
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    status: "A Ler",
    progress: 0,
    totalPages: 320,
    currentPage: 0,
    genre: "Autoajuda",
  },
]

export default function StudyTracker() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [sessions, setSessions] = useState<StudySession[]>(initialSessions)
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    status: "Ativo",
    color: "bg-blue-500",
  })
  const [newBook, setNewBook] = useState<Partial<Book>>({
    status: "A Ler",
  })

  // Pomodoro Timer
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutos
  const [selectedSubjectForTimer, setSelectedSubjectForTimer] = useState<string>("")
  const [timerType, setTimerType] = useState<"work" | "break">("work")

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsTimerActive(false)
      // Auto switch between work and break
      if (timerType === "work") {
        setTimerType("break")
        setTimeLeft(5 * 60) // 5 minute break
      } else {
        setTimerType("work")
        setTimeLeft(25 * 60) // 25 minute work
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, timeLeft, timerType])

  const addSubject = () => {
    if (newSubject.name) {
      const subject: Subject = {
        id: Date.now().toString(),
        name: newSubject.name,
        color: newSubject.color || "bg-blue-500",
        status: newSubject.status as Subject["status"],
        progress: 0,
        totalHours: newSubject.totalHours || 40,
        studiedHours: 0,
        deadline: newSubject.deadline,
        description: newSubject.description || "",
      }
      setSubjects([...subjects, subject])
      setNewSubject({
        status: "Ativo",
        color: "bg-blue-500",
      })
    }
  }

  const addBook = () => {
    if (newBook.title && newBook.author) {
      const book: Book = {
        id: Date.now().toString(),
        title: newBook.title,
        author: newBook.author,
        status: newBook.status as Book["status"],
        progress: 0,
        totalPages: newBook.totalPages || 300,
        currentPage: 0,
        notes: newBook.notes || "",
        genre: newBook.genre || "Geral",
      }
      setBooks([...books, book])
      setNewBook({
        status: "A Ler",
      })
    }
  }

  const updateBookProgress = (bookId: string, currentPage: number) => {
    setBooks(
      books.map((book) => {
        if (book.id === bookId) {
          const progress = Math.round((currentPage / book.totalPages) * 100)
          const status = progress === 100 ? "Lido" : progress > 0 ? "Lendo" : "A Ler"
          return {
            ...book,
            currentPage,
            progress,
            status,
            finishDate: progress === 100 ? new Date().toISOString().split("T")[0] : book.finishDate,
          }
        }
        return book
      }),
    )
  }

  const startTimer = () => {
    setIsTimerActive(true)
  }

  const pauseTimer = () => {
    setIsTimerActive(false)
  }

  const resetTimer = () => {
    setIsTimerActive(false)
    setTimeLeft(timerType === "work" ? 25 * 60 : 5 * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTotalStudyHours = () => {
    return subjects.reduce((total, subject) => total + subject.studiedHours, 0)
  }

  const getWeeklyStudyTime = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    return sessions
      .filter((session) => new Date(session.date) >= oneWeekAgo)
      .reduce((total, session) => total + session.duration, 0)
  }

  const SubjectCard = ({ subject }: { subject: Subject }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
            <h4 className="font-medium text-sm">{subject.name}</h4>
          </div>
          <Badge variant={subject.status === "Ativo" ? "default" : "outline"} className="text-xs">
            {subject.status}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground mb-3">{subject.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progresso</span>
            <span>{subject.progress}%</span>
          </div>
          <Progress value={subject.progress} className="h-2" />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {subject.studiedHours}h / {subject.totalHours}h
            </span>
            {subject.deadline && <span>{new Date(subject.deadline).toLocaleDateString("pt-BR")}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const BookCard = ({ book }: { book: Book }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-medium text-sm">{book.title}</h4>
            <p className="text-xs text-muted-foreground">{book.author}</p>
          </div>
          <Badge variant={book.status === "Lendo" ? "default" : "outline"} className="text-xs">
            {book.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progresso</span>
            <span>{book.progress}%</span>
          </div>
          <Progress value={book.progress} className="h-2" />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {book.currentPage} / {book.totalPages} páginas
            </span>
            <Badge variant="outline" className="text-xs">
              {book.genre}
            </Badge>
          </div>

          {book.status === "Lendo" && (
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                placeholder="Página atual"
                className="h-7 text-xs"
                max={book.totalPages}
                onChange={(e) => {
                  const page = Number.parseInt(e.target.value) || 0
                  if (page <= book.totalPages) {
                    updateBookProgress(book.id, page)
                  }
                }}
              />
            </div>
          )}

          {book.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < book.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Estudos & Leituras
          </h2>
          <p className="text-muted-foreground">Registre matérias, cadernos, tarefas e utilize o Timer Pomodoro</p>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Matéria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Matéria</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nome da matéria"
                  value={newSubject.name || ""}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                />

                <Textarea
                  placeholder="Descrição"
                  value={newSubject.description || ""}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Total de horas"
                    value={newSubject.totalHours || ""}
                    onChange={(e) => setNewSubject({ ...newSubject, totalHours: Number.parseInt(e.target.value) || 0 })}
                  />

                  <Input
                    type="date"
                    placeholder="Prazo"
                    value={newSubject.deadline || ""}
                    onChange={(e) => setNewSubject({ ...newSubject, deadline: e.target.value })}
                  />
                </div>

                <Select
                  value={newSubject.color}
                  onValueChange={(value) => setNewSubject({ ...newSubject, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-blue-500">Azul</SelectItem>
                    <SelectItem value="bg-green-500">Verde</SelectItem>
                    <SelectItem value="bg-purple-500">Roxo</SelectItem>
                    <SelectItem value="bg-red-500">Vermelho</SelectItem>
                    <SelectItem value="bg-yellow-500">Amarelo</SelectItem>
                    <SelectItem value="bg-pink-500">Rosa</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={addSubject} className="w-full">
                  Adicionar Matéria
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Livro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Livro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Título do livro"
                  value={newBook.title || ""}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                />

                <Input
                  placeholder="Autor"
                  value={newBook.author || ""}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Total de páginas"
                    value={newBook.totalPages || ""}
                    onChange={(e) => setNewBook({ ...newBook, totalPages: Number.parseInt(e.target.value) || 0 })}
                  />

                  <Input
                    placeholder="Gênero"
                    value={newBook.genre || ""}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  />
                </div>

                <Textarea
                  placeholder="Notas (opcional)"
                  value={newBook.notes || ""}
                  onChange={(e) => setNewBook({ ...newBook, notes: e.target.value })}
                />

                <Button onClick={addBook} className="w-full">
                  Adicionar Livro
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Horas</p>
                <p className="text-2xl font-bold text-primary">{getTotalStudyHours()}h</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold text-primary">{Math.round(getWeeklyStudyTime() / 60)}h</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Matérias Ativas</p>
                <p className="text-2xl font-bold text-primary">{subjects.filter((s) => s.status === "Ativo").length}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Livros Lendo</p>
                <p className="text-2xl font-bold text-primary">{books.filter((b) => b.status === "Lendo").length}</p>
              </div>
              <BookMarked className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subjects">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subjects">Matérias</TabsTrigger>
          <TabsTrigger value="books">Livros</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="sessions">Sessões</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
            {subjects.length === 0 && (
              <p className="text-center text-muted-foreground py-8 col-span-3">Nenhuma matéria cadastrada</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
            {books.length === 0 && (
              <p className="text-center text-muted-foreground py-8 col-span-3">Nenhum livro cadastrado</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pomodoro" className="space-y-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Timer className="h-5 w-5" />
                  Timer Pomodoro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">{formatTime(timeLeft)}</div>
                  <Badge variant={timerType === "work" ? "default" : "secondary"} className="text-sm">
                    {timerType === "work" ? "Foco" : "Pausa"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <Select value={selectedSubjectForTimer} onValueChange={setSelectedSubjectForTimer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects
                        .filter((s) => s.status === "Ativo")
                        .map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2 justify-center">
                    <Button onClick={startTimer} disabled={isTimerActive} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar
                    </Button>

                    <Button
                      onClick={pauseTimer}
                      disabled={!isTimerActive}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>

                    <Button onClick={resetTimer} variant="outline">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Técnica Pomodoro: 25min foco + 5min pausa</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sessões de Estudo Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{session.subjectName}</h4>
                          <p className="text-xs text-muted-foreground">{session.notes}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs mb-1">
                            {session.type}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(session.duration / 60)}h {session.duration % 60}min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(session.date).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {sessions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma sessão de estudo registrada</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
