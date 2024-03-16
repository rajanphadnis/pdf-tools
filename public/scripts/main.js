import { showPDF } from "./showPDF.js";

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
function download(file, filename, type) {
  const link = document.getElementById("link");
  link.download = filename;
  let binaryData = [];
  binaryData.push(file);
  link.href = URL.createObjectURL(new Blob(binaryData, { type: type }));
}
export async function merge() {
  let PDFDocument = PDFLib.PDFDocument;

  const in1 = document.getElementById("file1").files[0];
  const in2 = document.getElementById("file2").files[0];
  let bytes1 = await readFileAsync(in1);
  let bytes2 = await readFileAsync(in2);
  const pdf1 = await PDFDocument.load(bytes1);
  const pdf2 = await PDFDocument.load(bytes2);

  const mergedPdf = await PDFDocument.create();
  const copiedPagesA = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
  copiedPagesA.forEach((page) => mergedPdf.addPage(page));
  const copiedPagesB = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
  copiedPagesB.forEach((page) => mergedPdf.addPage(page));
  const mergedPdfFile = await mergedPdf.saveAsBase64({ dataUri: false });
  const mergedDownloadFile = await mergedPdf.save();
  const pages = mergedPdf.pageCount;

  showPDF(mergedPdfFile, pages);
  download(mergedDownloadFile, "download.pdf", "application/pdf");
}
