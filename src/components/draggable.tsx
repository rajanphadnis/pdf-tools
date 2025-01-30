import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  closestCenter,
  useDragDropContext,
  DragEventHandler,
  Id,
} from "@thisbeyond/solid-dnd";
import { Accessor, Component, createSignal, For, Setter } from "solid-js";

export const SortableHorizontalListExample: Component<{
  items: Accessor<Id[]>;
  setItems: Setter<Id[]>;
  files: Accessor<File[] | undefined>;
}> = (props) => {
  const [activeItem, setActiveItem] = createSignal<Id | null>(null);
  const ids = () => props.items();

  const onDragStart: DragEventHandler = ({ draggable }) => setActiveItem(draggable.id);

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = ids();
      const fromIndex = currentItems.indexOf(draggable.id);
      const toIndex = currentItems.indexOf(droppable.id);
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        props.setItems(updatedItems);
      }
    }
    setActiveItem(null);
  };

  return (
    <DragDropProvider onDragStart={onDragStart} onDragEnd={onDragEnd} collisionDetector={closestCenter}>
      <DragDropSensors />
      <div class="flex flex-col w-full h-fit items-center">
        <SortableProvider ids={ids()}>
          <For each={props.items()}>
            {(item) => <Sortable item={item} val={props.files()![(item as number) - 1]} />}
          </For>
        </SortableProvider>
      </div>
      <DragOverlay>
        <div class="sortable">{activeItem()}</div>
      </DragOverlay>
    </DragDropProvider>
  );
};

const Sortable: Component<{ item: Id; val: File }> = (props) => {
  const sortable = createSortable(props.item);
  const [state] = useDragDropContext()!;
  return (
    <div
      ref={sortable}
      style={{ "touch-action": "none" }}
      class="sortable bg-white rounded-md p-4 w-fit mt-3 hover:cursor-grab max-w-full overflow-auto"
      classList={{ "opacity-25": sortable.isActiveDraggable, "transition-transform": !!state.active.draggable }}
    >
      {props.val.name}
    </div>
  );
};
