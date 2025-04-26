import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="py-12 md:py-24 text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-1 rounded-full blur-xl bg-blue-500/20 dark:bg-blue-500/10"></div>
        <h1 className="relative text-4xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="gradient-text">FinSight AI</span>
        </h1>
      </div>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
        Your AI-powered financial filing assistant for exploring SEC filings. Ask natural language questions about
        companies' financials, risks, and more.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="#search-form">
          <Button
            size="lg"
            className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0"
          >
            Start Exploring <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
