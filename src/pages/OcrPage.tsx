import { useState, useCallback, useEffect, useRef } from "react"
import { Scan, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useOcr } from "@/hooks/useOcr"
import type { OcrSettings } from "@/types/ocr"
import { UploadCard } from "@/components/ocr/UploadCard"
import { ImagePreview } from "@/components/ocr/ImagePreview"
import { ProcessedImagePreview } from "@/components/ocr/ProcessedImagePreview"
import { OcrSettingsComponent } from "@/components/ocr/OcrSettings"
import { ResultPanel } from "@/components/ocr/ResultPanel"
import { HistogramChart } from "@/components/ocr/HistogramChart"
import { useToast } from "@/components/ui/toast"

const defaultSettings: OcrSettings = {
    language: "en",
}

type Step = 1 | 2

export function OcrPage() {
    const [step, setStep] = useState<Step>(1)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [settings, setSettings] = useState<OcrSettings>(defaultSettings)
    const { toast } = useToast()
    const hasAutoSwitchedRef = useRef(false)

    const {
        progress,
        isProcessing,
        result,
        error,
        processImage,
        reset,
    } = useOcr()

    useEffect(() => {
        if (result && !isProcessing && step === 1 && !hasAutoSwitchedRef.current) {
            hasAutoSwitchedRef.current = true
            // eslint-disable-next-line react-hooks/exhaustive-deps
            requestAnimationFrame(() => {
                setStep(2)
            })
        }
        if (step === 1 && !result) {
            hasAutoSwitchedRef.current = false
        }
    }, [result, isProcessing, step])

    const handleImageSelect = useCallback((file: File) => {
        setSelectedImage(file)
        const url = URL.createObjectURL(file)
        setImageUrl(url)
        reset()
        setStep(1)
        hasAutoSwitchedRef.current = false
    }, [reset])

    const handleClear = useCallback(() => {
        setSelectedImage(null)
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl)
        }
        setImageUrl(null)
        reset()
        setStep(1)
        hasAutoSwitchedRef.current = false
    }, [imageUrl, reset])

    const handleRecognize = useCallback(async () => {
        if (!selectedImage) return

        try {
            await processImage(selectedImage, settings)
            toast({
                title: "Success",
                description: "OCR processing completed successfully",
                variant: "default",
            })
            hasAutoSwitchedRef.current = true
            requestAnimationFrame(() => {
                setStep(2)
            })
        } catch {
            toast({
                title: "Error",
                description: error || "Failed to process image",
                variant: "destructive",
            })
        }
    }, [selectedImage, settings, processImage, error, toast])

    const handleBackToStep1 = useCallback(() => {
        setStep(1)
        hasAutoSwitchedRef.current = false
    }, [])

    const handleRetry = useCallback(() => {
        if (selectedImage) {
            handleRecognize()
        }
    }, [selectedImage, handleRecognize])

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg transition-transform hover:scale-105">
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

                <div className="mb-8 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${step >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-muted text-muted-foreground"
                            }`}>
                            <span className="text-sm font-semibold">1</span>
                        </div>
                        <span className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                            Upload Image
                        </span>
                    </div>
                    <div className={`h-0.5 w-16 transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
                    <div className="flex items-center gap-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${step >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-muted text-muted-foreground"
                            }`}>
                            <span className="text-sm font-semibold">2</span>
                        </div>
                        <span className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                            View Results
                        </span>
                    </div>
                </div>

                {step === 1 && (
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-2xl border bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
                            <h2 className="mb-4 text-lg font-semibold">Step 1: Upload Image</h2>

                            <UploadCard
                                onImageSelect={handleImageSelect}
                                selectedImage={selectedImage}
                                onClear={handleClear}
                                disabled={isProcessing}
                            />

                            {imageUrl && (
                                <>
                                    <div className="my-4">
                                        <OcrSettingsComponent
                                            settings={settings}
                                            onSettingsChange={setSettings}
                                            disabled={isProcessing}
                                        />
                                    </div>

                                    <div className="mb-4 flex gap-2">
                                        <Button
                                            onClick={handleRecognize}
                                            disabled={isProcessing || !selectedImage}
                                            className="flex-1 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                            size="lg"
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    Processing...
                                                </span>
                                            ) : (
                                                <>
                                                    <Scan className="mr-2 h-4 w-4" />
                                                    Recognize
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleClear}
                                            disabled={isProcessing}
                                            size="lg"
                                            className="transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Clear
                                        </Button>
                                    </div>

                                    <div className="my-6">
                                        <ImagePreview
                                            imageUrl={imageUrl}
                                            file={selectedImage}
                                            disabled={isProcessing}
                                            isScanning={isProcessing}
                                            title="Original Image"
                                        />
                                    </div>

                                    {isProcessing && (
                                        <div className="mt-4 space-y-3 rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10 p-4 shadow-lg">
                                            <div className="flex items-center justify-between text-sm font-medium">
                                                <span className="flex items-center gap-2">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                                                    </span>
                                                    Processing...
                                                </span>
                                                <span className="font-semibold text-primary">{progress}%</span>
                                            </div>
                                            <Progress value={progress} className="h-3 shadow-inner" />
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
                )}

                {step === 2 && result && imageUrl && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={handleBackToStep1}
                                className="transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Upload
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleClear}
                                className="transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Clear All
                            </Button>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-6">
                                <div className="rounded-2xl border bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
                                    <h2 className="mb-4 text-lg font-semibold">Step 2: Processed Image</h2>
                                    <ProcessedImagePreview
                                        imageUrl={imageUrl}
                                        result={result}
                                        disabled={false}
                                    />
                                </div>
                                
                                {/* Histogram Chart */}
                                {result.meta.histogram && (
                                    <div className="rounded-2xl border bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
                                        <HistogramChart histogram={result.meta.histogram} />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-2xl border bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
                                    <h2 className="mb-4 text-lg font-semibold">OCR Results</h2>
                                    <ResultPanel
                                        result={result}
                                        isLoading={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 1 && imageUrl && !isProcessing && (
                    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
                        <Button
                            onClick={handleRecognize}
                            disabled={!selectedImage}
                            size="lg"
                            className="h-14 w-14 rounded-full shadow-2xl transition-all hover:scale-110 hover:shadow-3xl active:scale-95"
                        >
                            <Scan className="h-6 w-6" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
