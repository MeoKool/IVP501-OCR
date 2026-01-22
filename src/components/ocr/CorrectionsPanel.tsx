import { Check, X } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Correction {
  lineId: string
  originalText: string
  correctedText: string
  confidence: number
}

interface CorrectionsPanelProps {
  corrections: Correction[]
  onCorrectionChange: (lineId: string, correctedText: string) => void
  onRemoveCorrection: (lineId: string) => void
  onApplyCorrections: (corrections: Correction[]) => void
}

export function CorrectionsPanel({
  corrections,
  onCorrectionChange,
  onRemoveCorrection,
  onApplyCorrections,
}: CorrectionsPanelProps) {
  if (corrections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No corrections added yet. Add low confidence lines from the
          Structured tab.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Corrections ({corrections.length})
        </h3>
        <Button
          onClick={() => onApplyCorrections(corrections)}
          size="sm"
          className="gap-2"
        >
          <Check className="h-4 w-4" />
          Apply Corrections
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {corrections.map((correction) => (
          <AccordionItem key={correction.lineId} value={correction.lineId}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <span className="text-sm">Line #{correction.lineId}</span>
                <Badge variant="destructive" className="text-xs">
                  {(correction.confidence * 100).toFixed(1)}%
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Original
                  </p>
                  <p className="text-sm">{correction.originalText}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Corrected
                  </p>
                  <Input
                    value={correction.correctedText}
                    onChange={(e) =>
                      onCorrectionChange(correction.lineId, e.target.value)
                    }
                    placeholder="Enter corrected text..."
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveCorrection(correction.lineId)}
                  className="w-full gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
