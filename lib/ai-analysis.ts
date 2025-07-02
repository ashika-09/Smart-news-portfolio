import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { PortfolioStock, NewsItem } from "./mock-data"

const OPENAI_KEY = process.env.OPENAI_API_KEY

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

export async function generatePortfolioInsights(portfolio: PortfolioStock[], news: NewsItem[]): Promise<InsightResult> {
  const portfolioSymbols = portfolio.map((stock) => stock.symbol).join(", ")
  const newsContent = news.map((item) => `${item.title}: ${item.content}`).join("\n\n")

  const prompt = `
    As a financial analyst, analyze the impact of recent news on this Indian stock portfolio:
    
    Portfolio Holdings: ${portfolioSymbols}
    
    Recent News:
    ${newsContent}
    
    Please provide a comprehensive analysis in the following JSON format:
    {
      "overallSentiment": "positive|negative|neutral",
      "confidenceScore": 85,
      "summary": "Brief overall impact summary",
      "stockAnalysis": [
        {
          "symbol": "STOCK_SYMBOL",
          "impact": "positive|negative|neutral",
          "confidence": 80,
          "reasoning": "Detailed reasoning for this stock"
        }
      ],
      "marketSentiment": "Overall market sentiment description",
      "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2"]
    }
    
    Focus on:
    1. How each news item affects the specific stocks in the portfolio
    2. Overall market sentiment and its impact
    3. Confidence levels based on news relevance and clarity
    4. Actionable recommendations for portfolio management
  `

  if (!OPENAI_KEY) {
    console.warn("OPENAI_API_KEY missing – returning fallback analysis")
    throw new Error("MISSING_KEY")
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are an expert financial analyst specializing in Indian stock markets. Provide accurate, data-driven insights based on news analysis. Always respond with valid JSON format.",
    })

    // Parse the AI response
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
    const result = JSON.parse(cleanedText) as InsightResult

    // Validate and ensure all portfolio stocks are analyzed
    const analyzedSymbols = result.stockAnalysis.map((analysis) => analysis.symbol)
    const missingSymbols = portfolio.filter((stock) => !analyzedSymbols.includes(stock.symbol))

    // Add analysis for missing stocks
    missingSymbols.forEach((stock) => {
      result.stockAnalysis.push({
        symbol: stock.symbol,
        impact: "neutral",
        confidence: 50,
        reasoning: "No specific news found for this stock in the current analysis period.",
      })
    })

    return result
  } catch (error) {
    console.error("AI Analysis Error:", error)

    // Fallback analysis if AI fails
    return {
      overallSentiment: "neutral",
      confidenceScore: 60,
      summary: "Detailed AI analysis unavailable (missing key or request failed). Please try again later.",
      stockAnalysis: portfolio.map((stock) => ({
        symbol: stock.symbol,
        impact: "neutral" as const,
        confidence: 50,
        reasoning: "Analysis temporarily unavailable. Manual review recommended.",
      })),
      marketSentiment: "Mixed signals in the current market environment require careful monitoring.",
      recommendations: [
        "Monitor your portfolio regularly for any significant changes",
        "Consider diversifying across different sectors",
        "Stay updated with latest financial news and market trends",
      ],
    }
  }
}
