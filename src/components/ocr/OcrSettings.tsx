import { Globe } from "lucide-react"
import type { OcrSettings } from "@/types/ocr"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

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
  const updateLanguage = (language: string) => {
    onSettingsChange({ ...settings, language })
  }

  return (
    <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="language">Language</Label>
        </div>
        <Select
          id="language"
          value={settings.language}
          onChange={(e) => updateLanguage(e.target.value)}
          disabled={disabled}
        >
          <option value="en">English</option>
          <option value="vi">Vietnamese</option>
        </Select>
      </div>
    </div>
  )
}
