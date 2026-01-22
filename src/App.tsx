import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { OcrPage } from "@/pages/OcrPage"

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/ocr" replace />} />
          <Route path="/ocr" element={<OcrPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ToastProvider>
  )
}

export default App
