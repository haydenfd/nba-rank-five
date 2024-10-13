import type { DroppableStateSnapshot } from "@hello-pangea/dnd";

const grid = 8;
const itemHeight = 90;
const maxItems = 5;
const calculatedHeight = itemHeight * maxItems;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  padding: grid,
  margin: `0 0 4px 0`,
  background: isDragging ? "#9370DB" : "white",
  border: "2px solid black",
  ...draggableStyle,
});

const getListStyle = (snapshot: DroppableStateSnapshot): React.CSSProperties => ({
  background: snapshot.isDraggingOver ? "darkblue" : "#98989c",
  padding: grid,
  width: "100%",
  height: `${calculatedHeight}px`,
  overflowY: "auto",
});

export { getListStyle, getItemStyle };
