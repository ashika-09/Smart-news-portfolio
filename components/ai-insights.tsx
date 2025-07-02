"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Brain, RefreshCw, AlertTriangle } from "lucide-react"
import type { PortfolioStock, NewsItem } from "@/lib/mock-data"
// import { generatePortfolioInsights } from "@/lib/ai-analysis" // Removed
interface AIInsightsProps {
  portfolio: PortfolioStock[]
  filteredNews: NewsItem[]
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

interface InsightResult {
  overallSentiment: "positive" | "negative" | "neutral"
  confidenceScore: number
  summary: string
  stockAnalysis: Array<{
    symbol: string
    impact: "positive" | "negative" | "neutral"
    confidence: number
    reasoning: string
  }>
  marketSentiment: string
  recommendations: string[]
}

export function AIInsights({ portfolio, filteredNews, isAnalyzing, setIsAnalyzing }: AIInsightsProps) {
  const [insights, setInsights] = useState<InsightResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzePortfolio = async () => {
    if (portfolio.length === 0) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio, news: filteredNews }),
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      const data: InsightResult = await res.json()
      setInsights(data)
    } catch (err) {
      setError("Failed to generate AI insights. Please try again.")
      console.error("AI Analysis Error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200"
      case "negative":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (portfolio.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Add stocks to your portfolio to get AI-powered insights and impact analysis.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Portfolio Insights
          </h2>
          <p className="text-gray-600 mt-1">AI-powered analysis of news impact on your holdings</p>
        </div>
        <Button
          onClick={analyzePortfolio}
          disabled={isAnalyzing || filteredNews.length === 0}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
          {isAnalyzing ? "Analyzing..." : "Analyze Portfolio"}
        </Button>
      </div>

      {filteredNews.length === 0 && (
        <Alert>
          <AlertDescription>
            No relevant news found for your portfolio. Add more stocks or wait for new articles.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Analyzing news impact on your portfolio...</span>
              </div>
              <Progress value={33} className="w-full" />
              <p className="text-sm text-gray-600">This may take a few moments</p>
            </div>
          </CardContent>
        </Card>
      )}

      {insights && (
        <div className="space-y-6">
          {/* Overall Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Overall Portfolio Impact
                <Badge className={getSentimentColor(insights.overallSentiment)}>
                  {getSentimentIcon(insights.overallSentiment)}
                  {insights.overallSentiment.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription>Confidence Score: {insights.confidenceScore}%</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{insights.summary}</p>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Market Sentiment</h4>
                <p className="text-sm text-gray-600">{insights.marketSentiment}</p>
              </div>
            </CardContent>
          </Card>

          {/* Individual Stock Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Stock Impact</CardTitle>
              <CardDescription>Detailed analysis for each holding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.stockAnalysis.map((analysis) => (
                <div key={analysis.symbol} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{analysis.symbol}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getSentimentColor(analysis.impact)}>
                        {getSentimentIcon(analysis.impact)}
                        {analysis.impact.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">{analysis.confidence}% confidence</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{analysis.reasoning}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Actionable insights based on current news</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {insights.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
