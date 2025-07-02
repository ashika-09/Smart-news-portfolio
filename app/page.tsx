"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NewsSection } from "@/components/news-section"
import { PortfolioManager } from "@/components/portfolio-manager"
import { AIInsights } from "@/components/ai-insights"
import { mockNews, type NewsItem, type PortfolioStock } from "@/lib/mock-data"

export default function SmartNewsPortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Filter news based on portfolio stocks
  useEffect(() => {
    if (portfolio.length > 0) {
      const portfolioSymbols = portfolio.map((stock) => stock.symbol.toLowerCase())
      const filtered = mockNews.filter((news) =>
        portfolioSymbols.some(
          (symbol) =>
            news.title.toLowerCase().includes(symbol) ||
            news.content.toLowerCase().includes(symbol) ||
            news.tags.some((tag) => tag.toLowerCase().includes(symbol)),
        ),
      )
      setFilteredNews(filtered)
    } else {
      setFilteredNews([])
    }
  }, [portfolio])

  const addToPortfolio = (stock: PortfolioStock) => {
    setPortfolio((prev) => {
      const existing = prev.find((s) => s.symbol === stock.symbol)
      if (existing) {
        return prev.map((s) => (s.symbol === stock.symbol ? { ...s, quantity: s.quantity + stock.quantity } : s))
      }
      return [...prev, stock]
    })
  }

  const removeFromPortfolio = (symbol: string) => {
    setPortfolio((prev) => prev.filter((stock) => stock.symbol !== symbol))
  }

  const updateQuantity = (symbol: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromPortfolio(symbol)
      return
    }
    setPortfolio((prev) => prev.map((stock) => (stock.symbol === symbol ? { ...stock, quantity } : stock)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Smart News + Portfolio Insights</h1>
          <p className="text-lg text-gray-600">AI-powered stock market news analysis for Indian markets</p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="news">General News</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="filtered">Filtered News</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-4">
            <NewsSection news={mockNews} title="Latest Indian Stock Market News" />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <PortfolioManager
              portfolio={portfolio}
              onAddStock={addToPortfolio}
              onRemoveStock={removeFromPortfolio}
              onUpdateQuantity={updateQuantity}
            />
          </TabsContent>

          <TabsContent value="filtered" className="space-y-4">
            {portfolio.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Add stocks to your portfolio to see filtered news relevant to your holdings.
                </AlertDescription>
              </Alert>
            ) : filteredNews.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No news found for your portfolio stocks. Try adding more stocks or check back later.
                </AlertDescription>
              </Alert>
            ) : (
              <NewsSection news={filteredNews} title={`News for Your Portfolio (${filteredNews.length} articles)`} />
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <AIInsights
              portfolio={portfolio}
              filteredNews={filteredNews}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockNews.length}</div>
              <p className="text-xs text-muted-foreground">Latest articles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolio.length}</div>
              <p className="text-xs text-muted-foreground">Tracked holdings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Relevant News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredNews.length}</div>
              <p className="text-xs text-muted-foreground">Portfolio-specific</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
