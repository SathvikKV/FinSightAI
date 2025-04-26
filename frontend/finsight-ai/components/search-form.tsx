"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SearchFormProps {
  initialQuery?: string | null
  initialFormType?: string | null
  initialTopK?: string | null
}

export default function SearchForm({ initialQuery = "", initialFormType = "", initialTopK = "5" }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery || "")
  const [formType, setFormType] = useState(initialFormType || "")
  const [topK, setTopK] = useState(initialTopK || "5")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const params = new URLSearchParams()
    params.set("query", query)
    if (formType) params.set("formType", formType)
    params.set("topK", topK)

    router.push(`/query?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 md:space-y-6 premium-border p-4 md:p-6 rounded-xl backdrop-blur-sm"
      id="search-form"
    >
      <div className="space-y-2">
        <Label htmlFor="query" className="text-base md:text-lg font-medium">
          Ask a question about financial filings
        </Label>
        <div className="relative">
          <Input
            id="query"
            placeholder="e.g., What were Apple's risks in 2022?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-10 md:h-12 text-sm md:text-base bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            required
          />
          <Search className="absolute left-3 top-3 md:top-3.5 h-4 md:h-5 w-4 md:w-5 text-muted-foreground" />
        </div>
        <p className="text-xs md:text-sm text-muted-foreground">
          Try questions about financials, risks, strategies, or market conditions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="form-type" className="text-xs md:text-sm font-medium">
            Form Type
          </Label>
          <Select value={formType} onValueChange={setFormType}>
            <SelectTrigger id="form-type" className="bg-background/50 border-border/50 h-9 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="All Forms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              <SelectItem value="10-K">10-K (Annual)</SelectItem>
              <SelectItem value="10-Q">10-Q (Quarterly)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="top-k" className="text-xs md:text-sm font-medium">
            Number of Results
          </Label>
          <Select value={topK} onValueChange={setTopK}>
            <SelectTrigger id="top-k" className="bg-background/50 border-border/50 h-9 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="5 Results" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Results</SelectItem>
              <SelectItem value="5">5 Results</SelectItem>
              <SelectItem value="10">10 Results</SelectItem>
              <SelectItem value="15">15 Results</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        size="default"
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 text-sm md:text-base py-2 md:py-6 h-auto"
      >
        Search Filings
      </Button>
    </form>
  )
}
