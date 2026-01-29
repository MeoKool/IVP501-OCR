import { useState, useCallback } from "react"
import { Upload, Camera, FileImage, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadCardProps {
  onImageSelect: (file: File) => void
  selectedImage: File | null
  onClear: () => void
  disabled?: boolean
}

export function UploadCard({
  onImageSelect,
  selectedImage,
  onClear,
  disabled,
}: UploadCardProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/bmp",
      "image/tiff",
      "image/webp",
    ]

    const validExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".tif", ".webp"]
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setError("Only PNG, JPG, JPEG, GIF, BMP, TIFF, or WEBP files are accepted")
      return false
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("File is too large. Please select a file smaller than 20MB")
      return false
    }
    setError(null)
    return true
  }

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        onImageSelect(file)
      }
    },
    [onImageSelect]
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    },
    [handleFile]
  )

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" disabled={disabled}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="camera" disabled>
            <Camera className="mr-2 h-4 w-4" />
            Camera/Scan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          {!selectedImage ? (
            <div
              className={cn(
                "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/bmp,image/tiff,image/webp"
                onChange={handleChange}
                disabled={disabled}
              />
              <FileImage className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 text-sm font-medium">
                Drag and drop an image here or{" "}
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-primary hover:underline"
                >
                  select a file
                </label>
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG, GIF, BMP, TIFF, WEBP up to 20MB
              </p>
              {error && (
                <p className="mt-2 text-sm text-destructive">{error}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{selectedImage.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClear}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="camera" className="mt-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 p-12">
            <Camera className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Camera/Scan feature is under development
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
