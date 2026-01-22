import type { OcrSettings } from "@/types/ocr"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

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
  const updateSetting = <K extends keyof OcrSettings>(
    key: K,
    value: OcrSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-sm font-medium">OCR Settings</h3>

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
  )
}
