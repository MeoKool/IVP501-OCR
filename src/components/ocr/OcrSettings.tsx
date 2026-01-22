import { useState } from "react"
import { ChevronDown, Settings } from "lucide-react"
import type { OcrSettings } from "@/types/ocr"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface OcrSettingsProps {
  settings: OcrSettings
  onSettingsChange: (settings: OcrSettings) => void
  disabled?: boolean
}

export function OcrSettingsComponent({
  settings,
  onSettingsChange,
  disabled,
}: OcrSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateSetting = <K extends keyof OcrSettings>(
    key: K,
    value: OcrSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card/50 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">OCR Settings</h3>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="space-y-4 border-t p-4 pt-4">
          <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select
          id="language"
          value={settings.language}
          onChange={(e) => updateSetting("language", e.target.value)}
          disabled={disabled}
        >
          <option value="English">English</option>
          <option value="Vietnamese">Vietnamese</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select
          id="model"
          value={settings.model}
          onChange={(e) => updateSetting("model", e.target.value)}
          disabled={disabled}
        >
          <option value="CNN+LSTM (default)">CNN+LSTM (default)</option>
          <option value="Transformer (beta)">Transformer (beta)</option>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-rotate" className="cursor-pointer">
            Auto rotate
          </Label>
          <Switch
            id="auto-rotate"
            checked={settings.autoRotate}
            onCheckedChange={(checked) =>
              updateSetting("autoRotate", checked)
            }
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="denoise" className="cursor-pointer">
            Denoise
          </Label>
          <Switch
            id="denoise"
            checked={settings.denoise}
            onCheckedChange={(checked) => updateSetting("denoise", checked)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="binarize" className="cursor-pointer">
            Binarize
          </Label>
          <Switch
            id="binarize"
            checked={settings.binarize}
            onCheckedChange={(checked) => updateSetting("binarize", checked)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="confidence">Confidence threshold</Label>
          <span className="text-sm text-muted-foreground">
            {settings.confidenceThreshold.toFixed(2)}
          </span>
        </div>
        <Slider
          id="confidence"
          min={0}
          max={1}
          step={0.01}
          value={[settings.confidenceThreshold]}
          onValueChange={(value) =>
            updateSetting("confidenceThreshold", value[0])
          }
          disabled={disabled}
          className="w-full"
        />
          </div>
        </div>
      )}
    </div>
  )
}
