import { useState } from "react"
import { Copy, Download, Check } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { OcrResult } from "@/types/ocr"
import { cn } from "@/lib/utils"

interface PlainTextTabProps {
  result: OcrResult
  onTextChange?: (text: string) => void
}

export function PlainTextTab({ result, onTextChange }: PlainTextTabProps) {
  const [text, setText] = useState(result.fullText)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ocr-result.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ocr-result.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleTextChange = (value: string) => {
    setText(value)
    onTextChange?.(value)
  }

  // Find low confidence words for highlighting
  const lowConfidenceWords = new Set<string>()
  result.lines.forEach((line) => {
    line.words.forEach((word) => {
      if (word.confidence < 0.75) {
        lowConfidenceWords.add(word.text.toLowerCase())
      }
    })
  })

  // Simple word highlighting (basic implementation)
  const renderHighlightedText = (text: string) => {
    const words = text.split(/(\s+)/)
    return words.map((word, idx) => {
      const isLowConfidence = lowConfidenceWords.has(
        word.toLowerCase().replace(/[^\w]/g, "")
      )
      return (
        <span
          key={idx}
          className={cn(
            isLowConfidence && "bg-yellow-200/50 dark:bg-yellow-900/30"
          )}
        >
          {word}
        </span>
      )
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Plain Text</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTxt}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            .txt
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadJson}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            .json
          </Button>
        </div>
      </div>
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          className="min-h-[400px] font-mono text-sm"
          placeholder="OCR result will appear here..."
        />
        <div className="pointer-events-none absolute inset-0 p-3 font-mono text-sm opacity-0">
          {renderHighlightedText(text)}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Words with low confidence are highlighted in yellow
      </p>
    </div>
  )
}
