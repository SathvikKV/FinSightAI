"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import SearchForm from "@/components/search-form"
import ResultsDisplay from "@/components/results-display"
import GptAnswerBox from "@/components/gpt-answer-box"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Chunk {
  text: string
  score: number
  metadata: {
    company: string
    filing_date: string
    item_number: string
    form_type: string
  }
}

export default function Results() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("query")
  const formType = searchParams.get("formType") || ""
  const topK = searchParams.get("topK") || "5"

  const [chunks, setChunks] = useState<Chunk[]>([])
  const [gptAnswer, setGptAnswer] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [gptLoading, setGptLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) {
      router.push("/")
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            top_k: Number.parseInt(topK),
            form_type: formType || undefined,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch results")
        }

        const data = await response.json()
        setChunks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, formType, topK, router])

  const handleGetGptAnswer = async () => {
    setGptLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/rag-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          top_k: Number.parseInt(topK),
          form_type: formType || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch GPT answer")
      }

      const data = await response.json()
      setGptAnswer(data.answer)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setGptLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto mb-8 premium-border p-4 rounded-xl backdrop-blur-sm">
        <SearchForm initialQuery={query} initialFormType={formType} initialTopK={topK} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full blur-xl bg-blue-500/20"></div>
            <Loader2 className="h-8 w-8 animate-spin text-primary relative" />
          </div>
          <span className="ml-4 text-lg">Searching financial filings...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {chunks.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  Results for: <span className="text-primary">{query}</span>
                </h2>
                {!gptAnswer && !gptLoading && (
                  <Button
                    onClick={handleGetGptAnswer}
                    disabled={gptLoading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0"
                  >
                    {gptLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      "Generate AI Answer"
                    )}
                  </Button>
                )}
              </div>

              {gptLoading && (
                <div className="flex justify-center items-center py-8 mb-8 bg-blue-500/5 premium-border rounded-lg">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full blur-xl bg-blue-500/20"></div>
                    <Loader2 className="h-8 w-8 animate-spin text-primary relative" />
                  </div>
                  <span className="ml-4 text-lg">Generating AI answer...</span>
                </div>
              )}

              {gptAnswer && <GptAnswerBox answer={gptAnswer} />}

              <ResultsDisplay chunks={chunks} query={query || ""} />
            </div>
          )}

          {chunks.length === 0 && !loading && (
            <div className="text-center py-12 premium-border rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search query or filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
