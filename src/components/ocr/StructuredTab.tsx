import { useState, useMemo } from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { OcrResult, Line } from "@/types/ocr"
import { cn } from "@/lib/utils"

interface StructuredTabProps {
  result: OcrResult
  onAddToCorrections?: (line: Line) => void
}

export function StructuredTab({
  result,
  onAddToCorrections,
}: StructuredTabProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLines = useMemo(() => {
    if (!searchQuery.trim()) return result.lines
    const query = searchQuery.toLowerCase()
    return result.lines.filter((line) =>
      line.text.toLowerCase().includes(query)
    )
  }, [result.lines, searchQuery])

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 0.9) return "default"
    if (confidence >= 0.75) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search lines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredLines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "No lines found matching your search"
                : "No lines available"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLines.map((line) => (
              <div
                key={line.id}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        Line #{line.id}
                      </span>
                      <Badge
                        variant={getConfidenceBadgeVariant(line.confidence)}
                        className="text-xs"
                      >
                        {(line.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-sm">{line.text}</p>
                    <div className="flex flex-wrap gap-1">
                      {line.words.map((word, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            "text-xs rounded px-1.5 py-0.5",
                            word.confidence >= 0.9
                              ? "bg-green-100 dark:bg-green-900/30"
                              : word.confidence >= 0.75
                              ? "bg-yellow-100 dark:bg-yellow-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          )}
                          title={`Confidence: ${(word.confidence * 100).toFixed(1)}%`}
                        >
                          {word.text}
                        </span>
                      ))}
                    </div>
                  </div>
                  {onAddToCorrections && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onAddToCorrections(line)}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
