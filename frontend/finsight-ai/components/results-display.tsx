"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Copy, Download, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

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

interface ResultsDisplayProps {
  chunks: Chunk[]
  query: string
}

export default function ResultsDisplay({ chunks, query }: ResultsDisplayProps) {
  // Function to highlight query terms in text
  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const terms = query.split(" ").filter((term) => term.length > 3)
    let highlightedText = text

    terms.forEach((term) => {
      const regex = new RegExp(`(${term})`, "gi")
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-blue-500/20 text-blue-200 px-0.5 rounded">$1</mark>',
      )
    })

    return highlightedText
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-semibold">Source Documents ({chunks.length})</h3>

      <div className="space-y-4">
        {chunks.map((chunk, index) => (
          <Card key={index} className="overflow-hidden premium-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 py-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-semibold border-blue-500/30 bg-blue-500/10">
                    {chunk.metadata.company}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/50">
                    {chunk.metadata.form_type}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(chunk.metadata.filing_date)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono border-blue-500/30 bg-blue-500/10">
                    Item {chunk.metadata.item_number}
                  </Badge>
                  <Badge variant="outline" className="font-mono border-blue-500/30 bg-blue-500/10">
                    Score: {chunk.score.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div
                className="prose dark:prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: highlightText(chunk.text, query),
                }}
              />

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10"
                  onClick={() => copyToClipboard(chunk.text)}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
