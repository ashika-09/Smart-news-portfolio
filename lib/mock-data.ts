export interface NewsItem {
  id: string
  title: string
  content: string
  source: string
  url: string
  publishedAt: string
  sentiment: "positive" | "negative" | "neutral"
  tags: string[]
}

export interface Stock {
  symbol: string
  name: string
  currentPrice: number
}

export interface PortfolioStock extends Stock {
  quantity: number
  price: number
}

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Reliance Industries Reports Strong Q3 Results, Beats Estimates",
    content:
      "Reliance Industries Ltd reported better-than-expected quarterly results driven by strong performance in its retail and digital services segments. The company's consolidated net profit rose 15% year-on-year.",
    source: "Economic Times",
    url: "https://economictimes.indiatimes.com",
    publishedAt: "2 hours ago",
    sentiment: "positive",
    tags: ["RELIANCE", "earnings", "retail", "digital"],
  },
  {
    id: "2",
    title: "TCS Announces Major Cloud Computing Deal Worth $2.5 Billion",
    content:
      "Tata Consultancy Services has secured a multi-year cloud transformation deal with a major European bank. This deal is expected to boost TCS's revenue growth in the coming quarters.",
    source: "Moneycontrol",
    url: "https://moneycontrol.com",
    publishedAt: "4 hours ago",
    sentiment: "positive",
    tags: ["TCS", "cloud", "deal", "technology"],
  },
  {
    id: "3",
    title: "HDFC Bank Faces Regulatory Scrutiny Over Digital Banking Issues",
    content:
      "HDFC Bank is under regulatory review following recent digital banking outages that affected millions of customers. The bank has assured quick resolution of technical issues.",
    source: "Business Standard",
    url: "https://business-standard.com",
    publishedAt: "6 hours ago",
    sentiment: "negative",
    tags: ["HDFCBANK", "regulatory", "digital", "banking"],
  },
  {
    id: "4",
    title: "Infosys Raises FY24 Revenue Guidance Amid Strong Demand",
    content:
      "Infosys has raised its revenue guidance for FY24 citing strong demand across all business segments. The company expects revenue growth of 13-15% in constant currency terms.",
    source: "Economic Times",
    url: "https://economictimes.indiatimes.com",
    publishedAt: "8 hours ago",
    sentiment: "positive",
    tags: ["INFY", "guidance", "revenue", "growth"],
  },
  {
    id: "5",
    title: "Adani Group Stocks Rally After Debt Reduction Announcement",
    content:
      "Adani Group stocks surged after the conglomerate announced plans to reduce debt by $2.5 billion through asset sales and improved cash flows from operations.",
    source: "Moneycontrol",
    url: "https://moneycontrol.com",
    publishedAt: "10 hours ago",
    sentiment: "positive",
    tags: ["ADANIPORTS", "debt", "rally", "financial"],
  },
  {
    id: "6",
    title: "ITC Reports Decline in Cigarette Sales Due to Tax Hikes",
    content:
      "ITC Ltd reported a decline in cigarette volumes following recent tax increases. However, the company's FMCG and hotel businesses showed strong growth.",
    source: "Business Standard",
    url: "https://business-standard.com",
    publishedAt: "12 hours ago",
    sentiment: "neutral",
    tags: ["ITC", "cigarettes", "tax", "FMCG"],
  },
  {
    id: "7",
    title: "Wipro Wins $500M Digital Transformation Contract",
    content:
      "Wipro has secured a major digital transformation contract worth $500 million from a Fortune 500 company. The deal spans five years and covers cloud migration and AI implementation.",
    source: "Economic Times",
    url: "https://economictimes.indiatimes.com",
    publishedAt: "14 hours ago",
    sentiment: "positive",
    tags: ["WIPRO", "contract", "digital", "AI"],
  },
  {
    id: "8",
    title: "Bharti Airtel 5G Network Expansion Accelerates",
    content:
      "Bharti Airtel has accelerated its 5G network rollout, covering 3,000 cities and towns. The company expects to complete pan-India 5G coverage by March 2024.",
    source: "Moneycontrol",
    url: "https://moneycontrol.com",
    publishedAt: "16 hours ago",
    sentiment: "positive",
    tags: ["BHARTIARTL", "5G", "network", "expansion"],
  },
]

export const popularStocks: Stock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", currentPrice: 2456.75 },
  { symbol: "TCS", name: "Tata Consultancy Services", currentPrice: 3678.9 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", currentPrice: 1543.25 },
  { symbol: "INFY", name: "Infosys Ltd", currentPrice: 1432.8 },
  { symbol: "ITC", name: "ITC Ltd", currentPrice: 456.3 },
  { symbol: "WIPRO", name: "Wipro Ltd", currentPrice: 432.15 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", currentPrice: 876.45 },
  { symbol: "ADANIPORTS", name: "Adani Ports & SEZ", currentPrice: 789.6 },
]
