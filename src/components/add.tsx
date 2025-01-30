import { Id } from "@thisbeyond/solid-dnd";
import { Accessor, Component, Setter } from "solid-js";

const AddNewFileButton: Component<{
  uploadedFiles: Accessor<File[] | undefined>;
  setUploadedFiles: Setter<File[] | undefined>;
  items: Accessor<Id[] | undefined>;
  setItems: Setter<Id[]>;
}> = (props) => {
  return (
    <button
      class="py-3 px-5 bg-purple-800 rounded-lg text-white font-bold hover:cursor-pointer hover:bg-purple-700"
      onclick={(el) => {
        const input = document.createElement("input");
        input.type = "file";
        (input as HTMLInputElement).onchange = (e) => {
          const file = (e.target! as HTMLInputElement).files![0];
          console.debug(file);
          const currentFiles = props.uploadedFiles();
          if (currentFiles) {
            const newList = [...currentFiles!, file];
            props.setUploadedFiles(newList);
            const vals = props.items()!.map((i) => Number(i));
            console.debug(vals);
            const maxItemsVal = newList.length;
            const newItemsList = [...vals, maxItemsVal];
            console.debug(newItemsList);
            props.setItems(newItemsList);
          } else {
            props.setUploadedFiles([file]);
          }
        };
        input.click();
      }}
    >
      Add File
    </button>
  );
};

export default AddNewFileButton;
