import { useMemo } from "react"
import { BarChart3 } from "lucide-react"
import type { Histogram } from "@/types/ocr"
import { Badge } from "@/components/ui/badge"

interface HistogramChartProps {
  histogram: Histogram
}

export function HistogramChart({ histogram }: HistogramChartProps) {
  const maxValue = useMemo(() => {
    return Math.max(...histogram.bins)
  }, [histogram.bins])

  const chartHeight = 200
  const barWidth = 40

  const getQualityColor = (hint: string) => {
    switch (hint.toLowerCase()) {
      case "bright":
        return "bg-yellow-500"
      case "dark":
        return "bg-gray-700"
      case "normal":
        return "bg-blue-500"
      default:
        return "bg-primary"
    }
  }

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Image Histogram</h3>
        </div>
        <Badge variant={getQualityBadgeVariant(histogram.qualityHint)}>
          {histogram.qualityHint}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card p-4">
        {/* Chart */}
        <div className="relative" style={{ height: `${chartHeight}px` }}>
          <div className="flex items-end justify-center gap-2 h-full">
            {histogram.bins.map((value, index) => {
              const height = maxValue > 0 ? (value / maxValue) * (chartHeight - 40) : 0
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1 group"
                  style={{ width: `${barWidth}px` }}
                >
                  <div
                    className={`w-full rounded-t-lg transition-all hover:opacity-80 ${getQualityColor(histogram.qualityHint)}`}
                    style={{
                      height: `${height}px`,
                      minHeight: value > 0 ? "2px" : "0px",
                    }}
                    title={`Bin ${index}: ${value} pixels`}
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {index}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Mean</p>
            <p className="text-sm font-semibold">{histogram.mean.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Std Dev</p>
            <p className="text-sm font-semibold">{histogram.std.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Max Value</p>
            <p className="text-sm font-semibold">{maxValue.toLocaleString()}</p>
          </div>
        </div>

        {/* X-axis label */}
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">Pixel Intensity (0-255)</p>
        </div>
      </div>
    </div>
  )
}
