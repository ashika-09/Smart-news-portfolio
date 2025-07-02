"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2 } from "lucide-react"
import { type PortfolioStock, popularStocks } from "@/lib/mock-data"

interface PortfolioManagerProps {
  portfolio: PortfolioStock[]
  onAddStock: (stock: PortfolioStock) => void
  onRemoveStock: (symbol: string) => void
  onUpdateQuantity: (symbol: string, quantity: number) => void
}

export function PortfolioManager({ portfolio, onAddStock, onRemoveStock, onUpdateQuantity }: PortfolioManagerProps) {
  const [newStock, setNewStock] = useState({ symbol: "", quantity: 1, price: 0 })

  const handleAddStock = () => {
    if (newStock.symbol && newStock.quantity > 0 && newStock.price > 0) {
      onAddStock({
        ...newStock,
        symbol: newStock.symbol.toUpperCase(),
        name: getStockName(newStock.symbol.toUpperCase()),
      })
      setNewStock({ symbol: "", quantity: 1, price: 0 })
    }
  }

  const getStockName = (symbol: string) => {
    const stock = popularStocks.find((s) => s.symbol === symbol)
    return stock?.name || symbol
  }

  const addPopularStock = (stock: (typeof popularStocks)[0]) => {
    onAddStock({
      symbol: stock.symbol,
      name: stock.name,
      quantity: 1,
      price: stock.currentPrice,
    })
  }

  const totalValue = portfolio.reduce((sum, stock) => sum + stock.quantity * stock.price, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Portfolio</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          Total Value: ₹{totalValue.toLocaleString("en-IN")}
        </Badge>
      </div>

      {/* Add New Stock */}
      <Card>
        <CardHeader>
          <CardTitle>Add Stock to Portfolio</CardTitle>
          <CardDescription>Enter stock details or select from popular stocks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., RELIANCE"
                value={newStock.symbol}
                onChange={(e) => setNewStock((prev) => ({ ...prev, symbol: e.target.value }))}
                className="uppercase"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={newStock.quantity}
                onChange={(e) => setNewStock((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={newStock.price}
                onChange={(e) => setNewStock((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddStock} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </div>
          </div>

          {/* Popular Stocks */}
          <div>
            <Label>Quick Add Popular Stocks</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {popularStocks.map((stock) => (
                <Button
                  key={stock.symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => addPopularStock(stock)}
                  disabled={portfolio.some((p) => p.symbol === stock.symbol)}
                >
                  {stock.symbol} - ₹{stock.currentPrice}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Holdings */}
      {portfolio.length === 0 ? (
        <Alert>
          <AlertDescription>
            Your portfolio is empty. Add some stocks to get started with personalized news and insights.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {portfolio.map((stock) => (
            <Card key={stock.symbol}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{stock.symbol}</h3>
                      <Badge variant="secondary">{stock.name}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Qty: {stock.quantity}</span>
                      <span>Price: ₹{stock.price}</span>
                      <span className="font-medium">
                        Value: ₹{(stock.quantity * stock.price).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(stock.symbol, stock.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{stock.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(stock.symbol, stock.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => onRemoveStock(stock.symbol)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
