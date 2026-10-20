import { PDFParse } from "pdf-parse";

/** Refuse to buffer uploads larger than this into memory for a text extraction attempt. */
const MAX_SERVER_EXTRACT_BYTES = 10 * 1024 * 1024;

export function isPdfUpload(mimeType: string | undefined, fileName: string): boolean {
  if (mimeType && mimeType.toLowerCase() === "application/pdf") return true;
  return fileName.toLowerCase().endsWith(".pdf");
}

/**
 * Server-side text extraction for PDF uploads whose text was not produced in the browser
 * (pdf.js worker blocked, exotic encodings, …). Best effort: returns "" whenever the PDF
 * cannot be read or has no text layer, so callers keep their existing validation path and
 * never receive a corrupt/truncated extraction.
 */
export async function extractPdfTextFromBase64(fileBase64: string): Promise<string> {
  try {
    const raw = fileBase64.includes(",") ? fileBase64.slice(fileBase64.indexOf(",") + 1) : fileBase64;
    const buffer = Buffer.from(raw, "base64");
    if (!buffer.length || buffer.length > MAX_SERVER_EXTRACT_BYTES) return "";

    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText();
      return String(result?.text ?? "")
        .replace(/\s+/g, " ")
        .trim();
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  } catch {
    return "";
  }
}
