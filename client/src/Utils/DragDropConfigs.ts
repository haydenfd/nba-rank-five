import type { DroppableStateSnapshot } from "@hello-pangea/dnd";

const grid = 4;
const itemHeight = 70;
const maxItems = 5;
const calculatedHeight = itemHeight * maxItems;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  padding: grid / 2,
  margin: `4px 0 4px 0`,
  background: isDragging ? "#9370DB" : "white",
  border: "1px solid black",
  ...draggableStyle,
});

const getListStyle = (snapshot: DroppableStateSnapshot): React.CSSProperties => ({
  background: snapshot.isDraggingOver ? "darkblue" : "#7a7a7f",
  padding: grid,
  width: "100%",
  height: `${calculatedHeight}px`,
  overflowY: "auto",
});

export { getListStyle, getItemStyle };
