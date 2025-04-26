import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import FloatingQueries from "@/components/floating-queries"
import SearchForm from "@/components/search-form"

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="py-8 md:py-16 text-center">
        <div className="relative mb-8">
          <div className="absolute -inset-1 rounded-full blur-xl bg-blue-500/20 dark:bg-blue-500/10"></div>
          <h1 className="relative text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="gradient-text">FinSight AI</span>
          </h1>
        </div>
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Your AI-powered financial filing assistant for exploring SEC filings. Ask natural language questions about
          companies' financials, risks, and more.
        </p>
        <div className="flex justify-center gap-4 mb-12">
          <Link href="/query">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0"
            >
              Start Exploring <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <SearchForm />
        </div>

        <div className="mt-12 md:mt-16">
          <h2 className="text-xl font-semibold mb-6">Popular Queries</h2>
          <FloatingQueries />
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          <div className="premium-border p-4 md:p-6 rounded-xl backdrop-blur-sm bg-card/50">
            <h3 className="text-lg font-semibold mb-3">Recent Filings</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <Link href="#">Apple Inc. (AAPL) - 10-Q</Link>
              </li>
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <Link href="#">Microsoft Corp (MSFT) - 10-K</Link>
              </li>
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <Link href="#">Tesla Inc (TSLA) - 10-Q</Link>
              </li>
            </ul>
          </div>

          <div className="premium-border p-4 md:p-6 rounded-xl backdrop-blur-sm bg-card/50">
            <h3 className="text-lg font-semibold mb-3">Popular Companies</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <Link href="#">Apple Inc. (AAPL)</Link>
              </li>
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <Link href="#">Microsoft Corp (MSFT)</Link>
              </li>
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <Link href="#">Amazon.com Inc (AMZN)</Link>
              </li>
            </ul>
          </div>

          <div className="premium-border p-4 md:p-6 rounded-xl backdrop-blur-sm bg-card/50 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-3">Common Topics</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <Link href="#">Risk Factors</Link>
              </li>
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <Link href="#">Revenue Growth</Link>
              </li>
              <li className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <Link href="#">Market Competition</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
