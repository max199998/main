"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { DataManager, LocalStorage, STORAGE_KEYS } from "@/lib/storage"
import { Download, Upload, Trash2, Database, AlertTriangle, CheckCircle } from "lucide-react"

export default function DataManagerComponent() {
  const [importData, setImportData] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    try {
      const data = DataManager.exportAll()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `productivity-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessage({ type: "success", text: "Backup exportado com sucesso!" })
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao exportar backup." })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = () => {
    if (!importData.trim()) {
      setMessage({ type: "error", text: "Por favor, cole os dados do backup." })
      return
    }

    setIsImporting(true)
    try {
      const success = DataManager.importAll(importData)
      if (success) {
        setMessage({ type: "success", text: "Backup importado com sucesso! Recarregue a página." })
        setImportData("")
      } else {
        setMessage({ type: "error", text: "Erro ao importar backup. Verifique o formato dos dados." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao processar backup." })
    } finally {
      setIsImporting(false)
    }
  }

  const handleClearAll = () => {
    if (confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
      DataManager.clearAll()
      setMessage({ type: "success", text: "Todos os dados foram limpos. Recarregue a página." })
    }
  }

  const getStorageStats = () => {
    const stats = Object.entries(STORAGE_KEYS).map(([name, key]) => {
      const data = LocalStorage.get(key, [])
      const size = JSON.stringify(data).length
      return {
        name: name.toLowerCase().replace("_", " "),
        key,
        items: Array.isArray(data) ? data.length : typeof data === "object" ? Object.keys(data).length : 1,
        size: `${(size / 1024).toFixed(1)} KB`,
      }
    })
    return stats
  }

  const storageStats = getStorageStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Gerenciamento de Dados
          </h2>
          <p className="text-muted-foreground">Backup, restauração e estatísticas dos seus dados</p>
        </div>
      </div>

      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          {message.type === "error" ? (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Exportar Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Baixe um arquivo JSON com todos os seus dados para backup seguro.
            </p>
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              {isExporting ? "Exportando..." : "Baixar Backup"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Importar Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Restaure seus dados a partir de um arquivo de backup.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  Restaurar Dados
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Importar Backup</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Cole aqui o conteúdo do arquivo JSON de backup..."
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    rows={8}
                    className="text-xs"
                  />
                  <Button onClick={handleImport} disabled={isImporting || !importData.trim()} className="w-full">
                    {isImporting ? "Importando..." : "Importar Dados"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Limpar Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Remove todos os dados armazenados. Use com cuidado!</p>
            <Button variant="destructive" onClick={handleClearAll} className="w-full">
              Limpar Tudo
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Armazenamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storageStats.map((stat) => (
              <div key={stat.key} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{stat.name}</h4>
                  <Badge variant="outline">{stat.size}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.items} {stat.items === 1 ? "item" : "itens"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Informações do Armazenamento</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Os dados são salvos automaticamente no navegador</li>
              <li>• Faça backup regularmente para não perder informações</li>
              <li>• Limpar dados do navegador remove todas as informações</li>
              <li>• Use a exportação para transferir dados entre dispositivos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
