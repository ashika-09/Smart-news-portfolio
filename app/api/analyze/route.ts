import { type NextRequest, NextResponse } from "next/server"
import { generatePortfolioInsights } from "@/lib/ai-analysis"

export async function POST(request: NextRequest) {
  try {
    const { portfolio, news } = await request.json()

    if (!portfolio || !Array.isArray(portfolio) || portfolio.length === 0) {
      return NextResponse.json({ error: "Portfolio data is required" }, { status: 400 })
    }

    const insights = await generatePortfolioInsights(portfolio, news || [])

    return NextResponse.json(insights)
  } catch (error) {
    console.error("Analysis API Error:", error)
    return NextResponse.json({ error: "Failed to analyze portfolio" }, { status: 500 })
  }
}
