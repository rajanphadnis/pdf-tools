import { createEffect, createSignal, For, mapArray, Show, type Component } from "solid-js";
import { mergeDocs } from "./util/merge";
import AddNewFileButton from "./components/add";
import MergeButton from "./components/merge";
import { SortableHorizontalListExample } from "./components/draggable";
import { Id } from "@thisbeyond/solid-dnd";

const App: Component = () => {
  const [uploadedFiles, setUploadedFiles] = createSignal<File[]>();
  const [items, setItems] = createSignal<Id[]>([1]);

  createEffect(() => {
    const files = uploadedFiles();
    console.debug(files);
  });

  createEffect(() => {
    const it = items();
    console.debug(it);
  });

  return (
    <div class="flex flex-col w-full h-full overflow-auto m-0 p-0">
      <h1 class="text-white font-bold text-2xl pl-3 pt-3">Rajan's PDF Merger</h1>
      <div class="w-full flex flex-row justify-between p-4">
        <AddNewFileButton
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          items={items}
          setItems={setItems}
        />
        <Show when={uploadedFiles() && uploadedFiles()!.length > 1} fallback={<></>}>
          <MergeButton uploadedFiles={uploadedFiles} itemOrder={items} />
        </Show>
      </div>
      <div class="w-full h-fit">
        <Show
          when={uploadedFiles()}
          fallback={
            <div class="flex flex-row justify-center items-center text-white">Click "Add File" to get started</div>
          }
        >
          <SortableHorizontalListExample items={items} setItems={setItems} files={uploadedFiles} />
          {/* <For each={uploadedFiles()!}>{(file, index) => <p>{file.name}</p>}</For> */}
        </Show>
      </div>
    </div>
  );
};

export default App;
