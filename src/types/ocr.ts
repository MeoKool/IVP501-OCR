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

export interface OcrMeta {
    processingMs: number
    language: string
    model: string
    rotated: boolean
    denoised: boolean
}

export interface OcrResult {
    fullText: string
    lines: Line[]
    meta: OcrMeta
}

export interface OcrSettings {
    language: string
    model: string
    autoRotate: boolean
    denoise: boolean
    binarize: boolean
    confidenceThreshold: number
}

export type ApiBoundingBox = [number, number][]

export interface ApiDetailedResult {
    text: string
    confidence: number
    bounding_box: ApiBoundingBox
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

export interface ApiOcrResponse {
    success: boolean
    extracted_text: string
    filename: string
    file_size_mb: number
    confidence: number
    num_detections: number
    timings: ApiTimings
    detailed_results: ApiDetailedResult[]
    model_info: ApiModelInfo
    message: string
}
