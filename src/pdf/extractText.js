import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * Extract text from PDF
 * @param {string} pdfPath
 * @returns {Promise<string>}
 */
export async function extractText(pdfPath) {
  try {
    const data = await fs.readFile(pdfPath);

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(data),
    });

    const pdf = await loadingTask.promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      text +=
        content.items
          .map((item) => item.str)
          .join(" ") + "\n";
    }

    return text;
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw error;
  }
}