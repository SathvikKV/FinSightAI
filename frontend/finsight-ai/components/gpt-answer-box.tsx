"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface GptAnswerBoxProps {
  answer: string
}

export default function GptAnswerBox({ answer }: GptAnswerBoxProps) {
  const [showSources, setShowSources] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer)
    // You could add a toast notification here
  }

  return (
    <Card className="mb-8 premium-border glow-effect bg-card/50 backdrop-blur-sm">
      <CardHeader className="bg-blue-500/10 pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-semibold">
            AI-generated summary
          </span>
          AI Answer
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="prose dark:prose-invert max-w-none">
          {answer.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 mt-4 pt-4 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSources(!showSources)}
            className="gap-1 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10"
          >
            {showSources ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Sources
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Sources
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" size="sm" className="gap-1 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {showSources && (
          <div className="mt-4 pt-4 border-t border-border/40">
            <h4 className="text-sm font-medium mb-2">Sources</h4>
            <p className="text-sm text-muted-foreground">
              The AI answer was generated based on the source documents shown below.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
