export interface BoundingBox {
    x: number
    y: number
    w: number
    h: number
}

export interface Word {
    text: string
    confidence: number
    bbox: BoundingBox
}

export interface Line {
    id: string
    text: string
    confidence: number
    words: Word[]
}

export interface Histogram {
    bins?: number[]
    counts?: number[]
    imageBase64?: string
    mean: number
    std: number
    qualityHint: string
}

export interface OcrTimings {
    totalMs: number
    imagePreprocessingMs: number
    ocrInferenceMs: number
    textPostprocessingMs: number
}

export interface OcrMeta {
    processingMs: number
    timings?: OcrTimings
    language: string
    model: string
    rotated: boolean
    denoised: boolean
    numDetections: number
    confidence: number
    filename: string
    fileSizeMB: number
    histogram?: Histogram
}

export interface OcrResult {
    fullText: string
    lines: Line[]
    meta: OcrMeta
}

export interface OcrSettings {
    language: string
}

export type ApiBoundingBox = [number, number][]

export interface ApiDetailedResult {
    text: string
    confidence: number
    bounding_box: ApiBoundingBox | { points: [number, number][] }
    line_number: number
}

export interface ApiTimings {
    total_ms: number
    image_preprocessing_ms: number
    ocr_inference_ms: number
    text_postprocessing_ms: number
}

export interface ApiModelInfo {
    engine: string
    version: string
    language: string
    use_custom_model: boolean
    use_gpu: boolean
    use_angle_cls: boolean
    initialized: boolean
}

export interface ApiHistogram {
    bins?: number[]
    counts?: number[]
    image_base64?: string
    mean: number
    std: number
    quality_hint: string
}

export interface ApiOcrResponse {
    success: boolean
    extracted_text: string
    filename: string
    file_size_mb: number
    confidence: number
    num_detections: number
    timings: ApiTimings
    detailed_results: ApiDetailedResult[]
    histogram?: ApiHistogram
    model_info: ApiModelInfo
    message: string
}
