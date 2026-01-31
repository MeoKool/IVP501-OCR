# Handwritten OCR - Handwriting Recognition Application

A web application for recognizing and extracting text from handwritten images using OCR (Optical Character Recognition) technology.

## Table of Contents

- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## System Requirements

Before starting, install the following tools:

### 1. Node.js and npm

**Node.js** is a JavaScript runtime environment. **npm** (Node Package Manager) comes with Node.js to manage libraries.

#### Check if already installed:

Open Terminal (Mac/Linux) or Command Prompt/PowerShell (Windows) and run:

```bash
node --version
npm --version
```

If version numbers are displayed (e.g., `v20.10.0` and `10.2.3`), installation is successful. If not, proceed with installation:

#### Installing Node.js:

1. Visit: https://nodejs.org/
2. Download the **LTS** (Long Term Support) version - recommended
3. Run the installer and follow the instructions
4. Restart Terminal/Command Prompt
5. Verify installation using the commands above

**Requirement:** Node.js version 18 or higher

### 2. Git (Optional)

If cloning the project from Git, Git needs to be installed:

- **Mac:** Already included or download from https://git-scm.com/
- **Windows:** Download from https://git-scm.com/download/win
- **Linux:** `sudo apt-get install git` (Ubuntu/Debian)

## Installation

### Step 1: Download the project source code

If you have a ZIP file:

1. Extract the ZIP file to a folder (e.g., `Desktop/IVP501-OCR`)

If cloning from Git:

```bash
git clone <url-repository>
cd IVP501-OCR
```

### Step 2: Open Terminal/Command Prompt in the project directory

**Method 1: Using VS Code integrated Terminal**

1. Open VS Code
2. File → Open Folder → Select the project folder
3. Terminal → New Terminal (or press ` Ctrl + ``  ` on Windows/Linux, ` Cmd + ``  ` on Mac)

**Method 2: Using Terminal/Command Prompt**

- **Windows:** Open Command Prompt, type `cd` and drag-drop the project folder
- **Mac/Linux:** Open Terminal, type `cd ` (with a space) and drag-drop the project folder

### Step 3: Install required dependencies

Run the following command to download all libraries required by the project:

```bash
npm install
```

This process may take 2-5 minutes depending on internet speed. Multiple lines of text will scroll by, which is normal.

**Note:**

- If encountering permission errors, try running with `sudo` (Mac/Linux) or open Command Prompt as Administrator (Windows)
- If encountering Python or build tool errors, they can be ignored if not necessary

### Step 4: Verify successful installation

After `npm install` completes, a `node_modules` folder will be created. This contains all the libraries.

## Running the Application

### Running in Development Mode

Run the following command:

```bash
npm run dev
```

A message similar to the following will appear:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Open the application in a browser

1. Open a web browser (Chrome, Firefox, Edge, Safari...)
2. Navigate to: **http://localhost:5173**

The OCR application interface will be displayed!

### Stop the application

In Terminal, press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac) to stop the server.

## Configuration

### Backend API Configuration

The application needs to connect to a backend API for OCR processing. By default, the application connects to:

```
http://localhost:8000
```

If the backend runs at a different address, modify the file:

**File:** `src/hooks/useOcr.ts`

Find the line:

```typescript
const API_BASE_URL = 'http://localhost:8000';
```

Change to the corresponding backend address:

```typescript
const API_BASE_URL = 'http://your-backend-url:port';
```

### Port Configuration

If port 5173 is already in use, Vite will automatically select another port (5174, 5175...). Check the Terminal for the port number.

To set a fixed port, modify `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Change to desired port
  },
  // ... rest of config
});
```

## Usage

### Usage workflow:

1. **Step 1: Upload Image**

   - Click the upload area or drag and drop an image file
   - Select language (English, Vietnamese, etc.)
   - Preview the image

2. **Step 2: Recognize**

   - Click the "Recognize" button
   - Wait for processing (progress bar will show)
   - Automatically transitions to step 2 when complete

3. **Step 3: View Results**
   - View the processed image
   - View histogram chart (if available)
   - View OCR results in "Plain Text" or "Structured" tabs
   - View statistics: word count, character count, confidence, processing time

### Features:

- Upload and preview images
- Recognize handwritten text in multiple languages
- Display results in plain text and structured formats
- Histogram chart for image quality analysis
- Detailed processing time statistics
- Zoom in/out images
- Clear and upload new images

## Project Structure

```
IVP501-OCR/
├── public/                 # Static files (logo, favicon...)
├── src/
│   ├── components/        # React components
│   │   ├── ocr/          # OCR-related components
│   │   └── ui/           # UI components (button, input...)
│   ├── hooks/            # Custom hooks (useOcr...)
│   ├── pages/            # Pages (OcrPage...)
│   ├── types/            # TypeScript type definitions
│   ├── lib/              # Utilities
│   ├── App.tsx           # Main component
│   └── main.tsx          # Entry point
├── package.json          # Dependencies list
├── vite.config.ts        # Vite configuration
└── README.md            # This file
```
