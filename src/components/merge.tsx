import { Accessor, Component, createSignal, Show } from "solid-js";
import { mergeDocs } from "../util/merge";
import { Id } from "@thisbeyond/solid-dnd";

const MergeButton: Component<{ uploadedFiles: Accessor<File[] | undefined>; itemOrder: Accessor<Id[]> }> = (props) => {
  const [loading, setLoading] = createSignal<boolean>(false);
  return (
    <button
      class="py-3 px-5 bg-green-700 rounded-lg font-bold text-white hover:cursor-pointer hover:bg-green-600"
      onclick={async () => {
        setLoading(true);
        const files = props.uploadedFiles()!;
        const itemOrder = props.itemOrder();
        let sorted: File[] = [];
        for (const item of itemOrder) {
          const index = (item as number) - 1;
          const file = files[index];
          sorted.push(file);
        }
        console.log(sorted);
        await mergeDocs(sorted, setLoading);
      }}
    >
      <Show when={loading()} fallback={"Merge ->"}>
        Merging...
      </Show>
    </button>
  );
};

export default MergeButton;
