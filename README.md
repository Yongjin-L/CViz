## CViz

Transform a static academic CV (PDF/TXT) into a dynamic, interactive research narrative: research pillars, career timeline, selected publications, and a network-style “citation map”.

### Features

- **Upload PDF or TXT**: Extracts text (PDF via `pdfjs-dist`) and analyzes it.
- **AI-driven structuring (Gemini)**: Produces a JSON profile (themes, timeline, publications, graph).
- **Interactive visualization**: Network graph + theme cards + timeline + publications list.

### Tech stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI**: Tailwind CSS + Motion
- **Visualization**: D3
- **PDF parsing**: `pdfjs-dist`
- **AI**: `@google/genai` (Gemini)

### Getting started

#### Prerequisites

- **Node.js**: recommended \(>= 18\)
- **Gemini API key**: from Google AI Studio

### Usage

1) Open the app in your browser.
2) Drag & drop a **PDF** or **TXT** CV (or click to upload).
3) Wait for analysis, then explore:
   - **Interactive Map** (network graph)
   - **Research Pillars**
   - **Career Path** (timeline)
   - **Selected Publications** (with DOI/URL links when available)

### Project structure (high level)

- **`src/App.tsx`**: upload → extract text → `analyzeCV()` → render dashboard
- **`src/services/gemini.ts`**: Gemini prompt + JSON schema
- **`src/services/pdf.ts`**: PDF text extraction via PDF.js
- **`src/components/`**: `Dashboard`, `FileUpload`, `CitationMap`, `Timeline`, `ThemeCard`

### Environment variables

- **`GEMINI_API_KEY`**: used by `src/services/gemini.ts` (injected at build/dev time via `vite.config.ts`).
