"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "Receita" | "Despesa"
  category: string
  date: string
  account: string
}

interface Account {
  id: string
  name: string
  type: "Conta Corrente" | "Poupança" | "Cartão de Crédito" | "Investimento"
  balance: number
  limit?: number
}

const initialTransactions: Transaction[] = [
  {
    id: "1",
    description: "Salário Janeiro",
    amount: 4500,
    type: "Receita",
    category: "Salário",
    date: "2025-01-01",
    account: "Conta Corrente",
  },
  {
    id: "2",
    description: "Supermercado",
    amount: 280,
    type: "Despesa",
    category: "Alimentação",
    date: "2025-01-15",
    account: "Cartão de Crédito",
  },
  {
    id: "3",
    description: "Aluguel",
    amount: 1200,
    type: "Despesa",
    category: "Moradia",
    date: "2025-01-05",
    account: "Conta Corrente",
  },
  {
    id: "4",
    description: "Freelance",
    amount: 800,
    type: "Receita",
    category: "Trabalho Extra",
    date: "2025-01-10",
    account: "Conta Corrente",
  },
  {
    id: "5",
    description: "Gasolina",
    amount: 150,
    type: "Despesa",
    category: "Transporte",
    date: "2025-01-12",
    account: "Cartão de Débito",
  },
  {
    id: "6",
    description: "Academia",
    amount: 89,
    type: "Despesa",
    category: "Saúde",
    date: "2025-01-08",
    account: "Conta Corrente",
  },
]

const initialAccounts: Account[] = [
  {
    id: "1",
    name: "Conta Corrente",
    type: "Conta Corrente",
    balance: 2450,
  },
  {
    id: "2",
    name: "Poupança",
    type: "Poupança",
    balance: 8900,
  },
  {
    id: "3",
    name: "Cartão de Crédito",
    type: "Cartão de Crédito",
    balance: -450,
    limit: 2000,
  },
  {
    id: "4",
    name: "Investimentos",
    type: "Investimento",
    balance: 15600,
  },
]

const categories = {
  Receita: ["Salário", "Trabalho Extra", "Investimento", "Outros"],
  Despesa: ["Alimentação", "Moradia", "Transporte", "Saúde", "Lazer", "Educação", "Roupas", "Outros"],
}

export default function FinancialControl() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: "Despesa",
    account: "Conta Corrente",
  })
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    type: "Conta Corrente",
  })

  const addTransaction = () => {
    if (newTransaction.description && newTransaction.amount && newTransaction.category) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        description: newTransaction.description,
        amount: newTransaction.amount,
        type: newTransaction.type as Transaction["type"],
        category: newTransaction.category,
        date: newTransaction.date || new Date().toISOString().split("T")[0],
        account: newTransaction.account || "Conta Corrente",
      }
      setTransactions([transaction, ...transactions])
      setNewTransaction({
        type: "Despesa",
        account: "Conta Corrente",
      })
    }
  }

  const addAccount = () => {
    if (newAccount.name && newAccount.type) {
      const account: Account = {
        id: Date.now().toString(),
        name: newAccount.name,
        type: newAccount.type as Account["type"],
        balance: newAccount.balance || 0,
        limit: newAccount.limit,
      }
      setAccounts([...accounts, account])
      setNewAccount({
        type: "Conta Corrente",
      })
    }
  }

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => {
      if (account.type === "Cartão de Crédito") {
        return total + account.balance // Negative balance for credit cards
      }
      return total + account.balance
    }, 0)
  }

  const getMonthlyIncome = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date)
        return (
          t.type === "Receita" &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        )
      })
      .reduce((total, t) => total + t.amount, 0)
  }

  const getMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date)
        return (
          t.type === "Despesa" &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        )
      })
      .reduce((total, t) => total + t.amount, 0)
  }

  const getExpensesByCategory = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const expenses = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return (
        t.type === "Despesa" &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      )
    })

    const categoryTotals: { [key: string]: number } = {}
    expenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {transaction.type === "Receita" ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <h4 className="font-medium text-sm">{transaction.description}</h4>
          </div>
          <div className={`font-bold text-sm ${transaction.type === "Receita" ? "text-green-600" : "text-red-600"}`}>
            {transaction.type === "Receita" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              {transaction.category}
            </Badge>
            <span>{transaction.account}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(transaction.date).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const AccountCard = ({ account }: { account: Account }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium text-sm">{account.name}</h4>
          </div>
          <Badge variant="outline" className="text-xs">
            {account.type}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className={`text-lg font-bold ${account.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(account.balance)}
          </div>

          {account.limit && account.type === "Cartão de Crédito" && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Limite disponível</span>
                <span>{formatCurrency(account.limit + account.balance)}</span>
              </div>
              <Progress value={((account.limit + account.balance) / account.limit) * 100} className="h-2" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const monthlyIncome = getMonthlyIncome()
  const monthlyExpenses = getMonthlyExpenses()
  const monthlyBalance = monthlyIncome - monthlyExpenses
  const expensesByCategory = getExpensesByCategory()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Controle Financeiro
          </h2>
          <p className="text-muted-foreground">Gerencie suas entradas, saídas, saldo e cartões</p>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Conta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nome da conta"
                  value={newAccount.name || ""}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                />

                <Select
                  value={newAccount.type}
                  onValueChange={(value) => setNewAccount({ ...newAccount, type: value as Account["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conta Corrente">Conta Corrente</SelectItem>
                    <SelectItem value="Poupança">Poupança</SelectItem>
                    <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                    <SelectItem value="Investimento">Investimento</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Saldo inicial"
                  value={newAccount.balance || ""}
                  onChange={(e) => setNewAccount({ ...newAccount, balance: Number.parseFloat(e.target.value) || 0 })}
                />

                {newAccount.type === "Cartão de Crédito" && (
                  <Input
                    type="number"
                    placeholder="Limite do cartão"
                    value={newAccount.limit || ""}
                    onChange={(e) => setNewAccount({ ...newAccount, limit: Number.parseFloat(e.target.value) || 0 })}
                  />
                )}

                <Button onClick={addAccount} className="w-full">
                  Adicionar Conta
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Transação</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Descrição"
                  value={newTransaction.description || ""}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Valor"
                    value={newTransaction.amount || ""}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, amount: Number.parseFloat(e.target.value) || 0 })
                    }
                  />

                  <Select
                    value={newTransaction.type}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, type: value as Transaction["type"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Receita">Receita</SelectItem>
                      <SelectItem value="Despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select
                  value={newTransaction.category}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[newTransaction.type || "Despesa"].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={newTransaction.date || ""}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  />

                  <Select
                    value={newTransaction.account}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.name}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addTransaction} className="w-full">
                  Adicionar Transação
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
                <p className="text-sm text-muted-foreground">Saldo Total</p>
                <p className={`text-2xl font-bold ${getTotalBalance() >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(getTotalBalance())}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receitas do Mês</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Despesas do Mês</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(monthlyExpenses)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo do Mês</p>
                <p className={`text-2xl font-bold ${monthlyBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(monthlyBalance)}
                </p>
              </div>
              <PieChart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="accounts">Contas</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.slice(0, 10).map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma transação registrada</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
            {accounts.length === 0 && (
              <p className="text-center text-muted-foreground py-8 col-span-2">Nenhuma conta cadastrada</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Categoria (Este Mês)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expensesByCategory.map(({ category, amount }) => {
                  const percentage = (amount / monthlyExpenses) * 100
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold">{formatCurrency(amount)}</span>
                          <span className="text-xs text-muted-foreground ml-2">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
                {expensesByCategory.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma despesa registrada este mês</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Mensal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total de Receitas</span>
                  <span className="font-bold text-green-600">{formatCurrency(monthlyIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total de Despesas</span>
                  <span className="font-bold text-red-600">{formatCurrency(monthlyExpenses)}</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Saldo do Mês</span>
                  <span className={`font-bold ${monthlyBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(monthlyBalance)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Taxa de Economia</span>
                    <span>{monthlyIncome > 0 ? ((monthlyBalance / monthlyIncome) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <Progress
                    value={monthlyIncome > 0 ? Math.max(0, (monthlyBalance / monthlyIncome) * 100) : 0}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total de Transações</span>
                  <span className="font-bold">{transactions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Contas Cadastradas</span>
                  <span className="font-bold">{accounts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Maior Receita</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(
                      Math.max(...transactions.filter((t) => t.type === "Receita").map((t) => t.amount), 0),
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Maior Despesa</span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(
                      Math.max(...transactions.filter((t) => t.type === "Despesa").map((t) => t.amount), 0),
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
