import { useMemo, useState } from "react"
import { BarChart3, Info } from "lucide-react"
import type { Histogram } from "@/types/ocr"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface HistogramChartProps {
  histogram: Histogram
}

export function HistogramChart({ histogram }: HistogramChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const maxValue = useMemo(() => {
    return Math.max(...histogram.bins)
  }, [histogram.bins])

  const chartHeight = 220
  const barWidth = 36

  const getQualityGradient = (hint: string) => {
    switch (hint.toLowerCase()) {
      case "bright":
        return "from-yellow-400 via-yellow-500 to-yellow-600"
      case "dark":
        return "from-gray-600 via-gray-700 to-gray-800"
      case "normal":
        return "from-blue-400 via-blue-500 to-blue-600"
      default:
        return "from-primary/80 via-primary to-primary/90"
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

  const getIntensityRange = (index: number) => {
    const rangeSize = 256 / histogram.bins.length
    const start = Math.floor(index * rangeSize)
    const end = Math.floor((index + 1) * rangeSize) - 1
    return { start, end }
  }

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
        {/* Chart Container */}
        <div className="relative" style={{ height: `${chartHeight}px` }}>
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <div
                key={ratio}
                className="h-px w-full border-t border-dashed border-muted-foreground/20"
                style={{ marginTop: ratio === 0 ? 0 : ratio === 1 ? 0 : "-1px" }}
              />
            ))}
          </div>

          {/* Bars */}
          <div className="relative flex items-end justify-center gap-1 h-full pb-8">
            {histogram.bins.map((value, index) => {
              const height = maxValue > 0 ? (value / maxValue) * (chartHeight - 50) : 0
              const intensityRange = getIntensityRange(index)
              const isHovered = hoveredIndex === index
              
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 group relative"
                  style={{ width: `${barWidth}px` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 rounded-lg bg-popover border shadow-lg px-3 py-2 min-w-[120px]">
                      <div className="text-xs font-semibold text-center mb-1">
                        Bin {index}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div className="flex justify-between gap-2">
                          <span>Range:</span>
                          <span className="font-medium">{intensityRange.start}-{intensityRange.end}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>Pixels:</span>
                          <span className="font-medium">{value.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>Percent:</span>
                          <span className="font-medium">
                            {((value / maxValue) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all duration-300 ease-out",
                      "bg-gradient-to-t",
                      getQualityGradient(histogram.qualityHint),
                      "shadow-sm",
                      isHovered && "shadow-lg scale-105",
                      !isHovered && "group-hover:opacity-90 group-hover:shadow-md"
                    )}
                    style={{
                      height: `${height}px`,
                      minHeight: value > 0 ? "3px" : "0px",
                    }}
                  />

                  {/* X-axis label */}
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    isHovered ? "text-primary font-semibold" : "text-muted-foreground"
                  )}>
                    {index}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-muted-foreground pr-2">
            <span>{maxValue.toLocaleString()}</span>
            <span>{(maxValue * 0.75).toLocaleString()}</span>
            <span>{(maxValue * 0.5).toLocaleString()}</span>
            <span>{(maxValue * 0.25).toLocaleString()}</span>
            <span>0</span>
          </div>
        </div>

        {/* X-axis label */}
        <div className="mt-4 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            Pixel Intensity (0-255)
          </p>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Info className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Mean</p>
            </div>
            <p className="text-lg font-bold text-foreground">{histogram.mean.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Average intensity</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Info className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Std Dev</p>
            </div>
            <p className="text-lg font-bold text-foreground">{histogram.std.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Variation</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Info className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Peak</p>
            </div>
            <p className="text-lg font-bold text-foreground">{maxValue.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Max pixels</p>
          </div>
        </div>
      </div>
    </div>
  )
}
