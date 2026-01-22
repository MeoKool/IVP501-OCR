import { useState, useCallback } from "react"
import { Scan, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useMockOcr } from "@/hooks/useMockOcr"
import type { OcrSettings } from "@/types/ocr"
import { UploadCard } from "@/components/ocr/UploadCard"
import { ImagePreview } from "@/components/ocr/ImagePreview"
import { OcrSettingsComponent } from "@/components/ocr/OcrSettings"
import { ResultPanel } from "@/components/ocr/ResultPanel"
import { useToast } from "@/components/ui/toast"

const defaultSettings: OcrSettings = {
    language: "English",
    model: "CNN+LSTM (default)",
    autoRotate: false,
    denoise: true,
    binarize: false,
    confidenceThreshold: 0.5,
}

export function OcrPage() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [settings, setSettings] = useState<OcrSettings>(defaultSettings)
    const { toast } = useToast()

    const {
        progress,
        isProcessing,
        result,
        error,
        processImage,
        reset,
    } = useMockOcr()

    const handleImageSelect = useCallback((file: File) => {
        setSelectedImage(file)
        const url = URL.createObjectURL(file)
        setImageUrl(url)
        reset()
    }, [reset])

    const handleClear = useCallback(() => {
        setSelectedImage(null)
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl)
        }
        setImageUrl(null)
        reset()
    }, [imageUrl, reset])

    const handleRecognize = useCallback(async () => {
        if (!selectedImage) return

        try {
            await processImage(settings)
            toast({
                title: "Success",
                description: "OCR processing completed successfully",
                variant: "default",
            })
        } catch {
            toast({
                title: "Error",
                description: error || "Failed to process image",
                variant: "destructive",
            })
        }
    }, [selectedImage, settings, processImage, error, toast])

    const handleRetry = useCallback(() => {
        if (selectedImage) {
            handleRecognize()
        }
    }, [selectedImage, handleRecognize])

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Scan className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Handwritten OCR</h1>
                            <p className="text-sm text-muted-foreground">
                                Extract text from handwritten images
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Left Column - Input */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border bg-card p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold">Input</h2>

                            <UploadCard
                                onImageSelect={handleImageSelect}
                                selectedImage={selectedImage}
                                onClear={handleClear}
                                disabled={isProcessing}
                            />

                            {imageUrl && (
                                <>
                                    <div className="my-6">
                                        <ImagePreview imageUrl={imageUrl} disabled={isProcessing} />
                                    </div>

                                    <OcrSettingsComponent
                                        settings={settings}
                                        onSettingsChange={setSettings}
                                        disabled={isProcessing}
                                    />

                                    <div className="mt-6 flex gap-2">
                                        <Button
                                            onClick={handleRecognize}
                                            disabled={isProcessing || !selectedImage}
                                            className="flex-1"
                                            size="lg"
                                        >
                                            {isProcessing ? "Processing..." : "Recognize"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleClear}
                                            disabled={isProcessing}
                                            size="lg"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Clear
                                        </Button>
                                    </div>

                                    {isProcessing && (
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>Processing...</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <Progress value={progress} className="h-2" />
                                        </div>
                                    )}

                                    {error && (
                                        <div className="mt-4 rounded-lg border border-destructive bg-destructive/10 p-4">
                                            <p className="text-sm font-medium text-destructive">
                                                {error}
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRetry}
                                                className="mt-2"
                                            >
                                                Retry
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Output */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border bg-card p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold">Output</h2>
                            <ResultPanel
                                result={result}
                                isLoading={isProcessing}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
