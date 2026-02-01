import { BarChart3 } from "lucide-react"
import type { Histogram } from "@/types/ocr"
import { Badge } from "@/components/ui/badge"

interface HistogramChartProps {
  histogram: Histogram
}

export function HistogramChart({ histogram }: HistogramChartProps) {
  const getQualityBadgeVariant = (hint: string) => {
    switch (hint.toLowerCase()) {
      case "bright":
        return "secondary"
      case "dark":
        return "destructive"
      case "normal":
        return "default"
      default:
        return "default"
    }
  }

  // If we have base64 image, display it
  if (histogram.imageBase64) {
    const imageSrc = `data:image/png;base64,${histogram.imageBase64}`
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Image Histogram</h3>
              <p className="text-xs text-muted-foreground">Pixel intensity distribution</p>
            </div>
          </div>
          <Badge variant={getQualityBadgeVariant(histogram.qualityHint)} className="capitalize">
            {histogram.qualityHint}
          </Badge>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-card to-card/50 p-6 shadow-sm">
          <div className="flex items-center justify-center">
            <img
              src={imageSrc}
              alt="Histogram Chart"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Mean</p>
              <p className="text-lg font-bold text-foreground">{histogram.mean.toFixed(2)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Average intensity</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Std Dev</p>
              <p className="text-lg font-bold text-foreground">{histogram.std.toFixed(2)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Variation</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Quality</p>
              <Badge variant={getQualityBadgeVariant(histogram.qualityHint)} className="capitalize">
                {histogram.qualityHint}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback: return null if no image
  return null
}
