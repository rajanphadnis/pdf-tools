import { Setter } from "solid-js";
import { download, readFileAsync } from "./util";
import { PDFDocument } from "pdf-lib";

export async function mergeDocs(uploadedFiles: File[], setLoading: Setter<boolean>) {
  const mergedPdf = await PDFDocument.create();
  for (const file of uploadedFiles) {
    const bytes = await readFileAsync(file);
    const pdfLoaded = await PDFDocument.load(bytes!);
    const copiedPages = await mergedPdf.copyPages(pdfLoaded, pdfLoaded.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }
  const mergedDownloadFile = await mergedPdf.save();

  download(mergedDownloadFile, "download.pdf", "application/pdf");
  setLoading(false);
}
