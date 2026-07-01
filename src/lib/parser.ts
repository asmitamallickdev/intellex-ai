import mammoth from "mammoth";
import Papa from "papaparse";
import { ParsedDocumentResult } from "../types/ingestion";

/**
 * Extracts raw text from document buffer based on file extension / type.
 */
export async function parseDocument(
  filename: string,
  buffer: Buffer
): Promise<ParsedDocumentResult> {
  const ext = filename.split(".").pop()?.toLowerCase();

  const result: ParsedDocumentResult = {
    text: "",
    title: filename,
    isUnsupported: false,
    pageCount: 1,
  };

  switch (ext) {
    case "txt":
    case "md":
      result.text = buffer.toString("utf8");
      break;

    case "csv":
      const csvStr = buffer.toString("utf8");
      const csvParsed = Papa.parse(csvStr, { skipEmptyLines: true });
      // Format rows as tab-separated values or lines
      result.text = csvParsed.data
        .map((row: any) => (Array.isArray(row) ? row.join("\t") : String(row)))
        .join("\n");
      break;

    case "pdf":
      try {
        const { PDFParse } = require("pdf-parse");
        const parser = new PDFParse({ data: buffer });
        const pdfData = await parser.getText();
        result.text = pdfData.text || "";
        result.pageCount = typeof pdfData.total === "number" ? pdfData.total : (pdfData.pages?.length || 0);
      } catch (err: any) {
        console.error(`[Parser] Error reading PDF:`, err);
        throw new Error(`Failed to parse PDF document: ${err.message}`);
      }
      break;

    case "docx":
      try {
        const docxResult = await mammoth.extractRawText({ buffer });
        result.text = docxResult.value;
      } catch (err: any) {
        console.error(`[Parser] Error reading DOCX:`, err);
        throw new Error(`Failed to parse DOCX document: ${err.message}`);
      }
      break;

    case "xlsx":
    case "pptx":
    case "png":
    case "jpg":
    case "jpeg":
    case "svg":
    case "webp":
    case "dwg":
      // Mark as unsupported for future OCR/advanced pipelines
      result.isUnsupported = true;
      result.text = "";
      break;

    default:
      result.isUnsupported = true;
      result.text = "";
      break;
  }

  return result;
}
