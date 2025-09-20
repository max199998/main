"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useNotifications } from "@/lib/notifications"
import {
  Bell,
  Trash2,
  Check,
  CheckCheck,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Volume2,
  VolumeX,
  Moon,
} from "lucide-react"

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  reminder: Clock,
}

const notificationColors = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  reminder: "text-purple-500",
}

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    remove,
    clear,
    settings,
    updateSettings,
    requestPermission,
  } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)

  const handlePermissionRequest = async () => {
    const granted = await requestPermission()
    if (granted) {
      // Show success notification
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Agora"
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative h-8 w-8 p-0 bg-transparent">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Notificações
            {unreadCount > 0 && <Badge variant="secondary">{unreadCount} não lidas</Badge>}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Marcar todas como lidas
                </Button>
                <Button variant="outline" size="sm" onClick={clear} disabled={notifications.length === 0}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Limpar todas
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma notificação</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = notificationIcons[notification.type]
                    const iconColor = notificationColors[notification.type]

                    return (
                      <Card
                        key={notification.id}
                        className={`hover:shadow-md transition-shadow cursor-pointer ${
                          !notification.read ? "border-primary/50 bg-primary/5" : ""
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{notification.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(notification.timestamp)}
                                  </span>
                                  {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <div className="flex gap-2">
                                  {notification.actionUrl && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-xs bg-transparent"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        window.location.href = notification.actionUrl!
                                      }}
                                    >
                                      {notification.actionLabel || "Ver"}
                                    </Button>
                                  )}
                                </div>

                                <div className="flex gap-1">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        markAsRead(notification.id)
                                      }}
                                    >
                                      <Check className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      remove(notification.id)
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações Habilitadas</Label>
                      <p className="text-sm text-muted-foreground">Ativar/desativar todas as notificações</p>
                    </div>
                    <Switch
                      checked={settings.enabled}
                      onCheckedChange={(checked) => updateSettings({ enabled: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações do Navegador</Label>
                      <p className="text-sm text-muted-foreground">
                        Mostrar notificações mesmo quando a aba não estiver ativa
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!settings.browserNotifications && (
                        <Button variant="outline" size="sm" onClick={handlePermissionRequest}>
                          Permitir
                        </Button>
                      )}
                      <Switch
                        checked={settings.browserNotifications}
                        onCheckedChange={(checked) => updateSettings({ browserNotifications: checked })}
                        disabled={!settings.browserNotifications}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-2">
                      {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      <div>
                        <Label>Som das Notificações</Label>
                        <p className="text-sm text-muted-foreground">Reproduzir som ao receber notificações</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tipos de Notificação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Lembretes de Tarefas</Label>
                    <Switch
                      checked={settings.taskReminders}
                      onCheckedChange={(checked) => updateSettings({ taskReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Lembretes de Eventos</Label>
                    <Switch
                      checked={settings.eventReminders}
                      onCheckedChange={(checked) => updateSettings({ eventReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Lembretes de Estudo</Label>
                    <Switch
                      checked={settings.studyReminders}
                      onCheckedChange={(checked) => updateSettings({ studyReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Alertas Financeiros</Label>
                    <Switch
                      checked={settings.financialAlerts}
                      onCheckedChange={(checked) => updateSettings({ financialAlerts: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Moon className="h-5 w-5" />
                    Horário Silencioso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Ativar Horário Silencioso</Label>
                      <p className="text-sm text-muted-foreground">
                        Silenciar notificações durante determinado período
                      </p>
                    </div>
                    <Switch
                      checked={settings.quietHours.enabled}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          quietHours: { ...settings.quietHours, enabled: checked },
                        })
                      }
                    />
                  </div>

                  {settings.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Início</Label>
                        <Input
                          type="time"
                          value={settings.quietHours.start}
                          onChange={(e) =>
                            updateSettings({
                              quietHours: { ...settings.quietHours, start: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fim</Label>
                        <Input
                          type="time"
                          value={settings.quietHours.end}
                          onChange={(e) =>
                            updateSettings({
                              quietHours: { ...settings.quietHours, end: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
