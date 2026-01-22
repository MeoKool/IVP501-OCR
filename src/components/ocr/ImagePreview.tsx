import { useState } from "react"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  imageUrl: string
  disabled?: boolean
  isScanning?: boolean
}

export function ImagePreview({ imageUrl, disabled, isScanning = false }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1)
  const [fit, setFit] = useState(true)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
    setFit(false)
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
    setFit(false)
  }

  const handleFit = () => {
    setFit(true)
    setZoom(1)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Image Preview</h3>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={disabled || zoom <= 0.5}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleFit}
            disabled={disabled}
            aria-label="Fit to screen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={disabled || zoom >= 3}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg border bg-muted/50 shadow-lg">
        <div
          className="flex items-center justify-center overflow-auto p-4"
          style={{ minHeight: "300px", maxHeight: "500px" }}
        >
          <img
            src={imageUrl}
            alt="Preview"
            className={cn(
              "transition-transform duration-300",
              fit ? "max-w-full max-h-full object-contain" : "",
              isScanning && "brightness-95"
            )}
            style={
              !fit
                ? {
                    transform: `scale(${zoom})`,
                    transformOrigin: "center",
                  }
                : undefined
            }
          />
          {/* Scan line animation */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/70 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scan" />
            </div>
          )}
          {/* Scanning overlay effect */}
          {isScanning && (
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 animate-pulse" />
          )}
        </div>
        {!fit && (
          <div className="absolute bottom-2 right-2 rounded-lg bg-black/70 backdrop-blur-sm px-2 py-1 text-xs text-white shadow-lg">
            {Math.round(zoom * 100)}%
          </div>
        )}
        {isScanning && (
          <div className="absolute top-2 left-2 rounded-lg bg-primary/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg animate-pulse">
            Scanning...
          </div>
        )}
      </div>
    </div>
  )
}
