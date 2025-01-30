export function readFileAsync(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
export function download(file: Uint8Array<ArrayBufferLike>, filename: string, type: string) {
  const link = document.createElement("a");
  link.download = filename;
  let binaryData = [];
  binaryData.push(file);
  link.href = URL.createObjectURL(new Blob(binaryData, { type: type }));
  link.click();
}
