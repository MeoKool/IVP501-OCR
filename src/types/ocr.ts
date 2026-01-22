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
