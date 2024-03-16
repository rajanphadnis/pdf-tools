import * as pdfjsLib from "/scripts/pdfjs/build/pdf.mjs";

var pdfFile;
function generateCanvases(pages) {
  var gridContainer = document.getElementById("grid-container");
  for (let pageNumber = 1; pageNumber <= pages; pageNumber++) {
    var canvas = document.createElement("canvas");
    var div = document.createElement("div");
    div.id = "divDraggable" + pageNumber.toString();
    div.classList.add("divDraggable");
    div.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    div.addEventListener("drop", function (event) {
      onDropHandler(event, pageNumber);
    });
    canvas.classList.add("grid-item");
    canvas.id = "canvasID" + pageNumber.toString();
    canvas.draggable = true;
    canvas.addEventListener("dragstart", function (event) {
      onDragHandler(event, pageNumber);
    });
    // canvas.style.height = 200;
    // canvas.style.width = 100;
    // canvas.height = 200;
    // canvas.width = 100;
    div.appendChild(canvas);
    gridContainer.appendChild(div);
  }
}
export function showPDF(pdfDataUri, pageCount) {
  generateCanvases(pageCount);
  // The workerSrc property shall be specified.
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "/scripts/pdfjs/build/pdf.worker.mjs";

  // Using DocumentInitParameters object to load binary data.
  pdfjsLib
    .getDocument({ data: atob(pdfDataUri), disableStream: true })
    .promise.then(function (pdf) {
      for (var i = 1; i <= pageCount; i++) {
        pdfFile = pdf;
        var canvas = document.getElementById("canvasID" + i.toString());
        var context = canvas.getContext("2d");
        openPage(pdf, i, context);
      }
    });
}

function openPage(pdfFile, pageNumber, context) {
  pdfFile.getPage(pageNumber).then(function (page) {
    var canvas = context.canvas;
    var scale = canvas.width / page.getViewport({ scale: 1 }).width;
    // var scale = 1.5;
    var viewport = page.getViewport({ scale: scale });
    // Support HiDPI-screens.
    var outputScale = window.devicePixelRatio || 1;

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + "px";
    canvas.style.height = Math.floor(viewport.height) + "px";

    var transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

    var renderContext = {
      canvasContext: context,
      transform: transform,
      viewport: viewport,
    };
    page.render(renderContext);
  });
}

function onDragHandler(event, movingPageNumber) {
  event.dataTransfer.setData("text", movingPageNumber);
  console.log("drag started on event");
  console.log(movingPageNumber);
}

function onDropHandler(event, destinationNumber) {
  event.preventDefault();
  const movingPageNumber = event.dataTransfer.getData("text").toString();
  const destinationPageNumber = destinationNumber.toString();
  console.log(movingPageNumber + " -> " + destinationPageNumber);

  var movingCanvas = document.getElementById("canvasID" + movingPageNumber);
  var movingDiv = document.getElementById("canvasID" + movingPageNumber).parentNode;
  var destCanvas = document.getElementById("divDraggable" + destinationPageNumber).firstChild;
  var destDiv = document.getElementById("divDraggable" + destinationPageNumber);

  destDiv.appendChild(movingCanvas);
  movingDiv.appendChild(destCanvas);

}
