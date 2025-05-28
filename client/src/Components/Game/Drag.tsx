import React from "react";
import { getItemStyle, getListStyle } from "../../Utils/DragDropConfigs";
import { Button } from "@nextui-org/react";
import { DropResult, DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card } from "./Card";
import { useGameContext,  AttemptsType } from "../../Context/GameContext";

export const Drag: React.FC = () => {
  const {
    players,
    setPlayers,
    category,
    attempts,
    setAttempts,
    // evaluateGuesses,
    setLastAttempt,
    resetToLastAttempt,
  } = useGameContext();

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedPlayers = [...players];
    const [removed] = updatedPlayers.splice(source.index, 1);
    updatedPlayers.splice(destination.index, 0, removed);
    setPlayers(updatedPlayers);
  };

  const handleSubmitAttempt = async () => {
    // console.log(players);
    if (attempts <= 2) {
      const nextAttempt = (attempts + 1) as AttemptsType;
      setAttempts(nextAttempt);
      setLastAttempt(players);
    }
    // await evaluateGuesses();
  };

  return (
    <>
      <section className="mx-auto text-white text-xl font-medium my-2">
        Category: {category}
      </section>
      <section className="mx-auto text-white text-xl font-medium my-2">
        Attempts left: {3 - attempts}
      </section>
      <div className="w-full flex flex-col items-center space-y-10 mt-6">
        <div className="w-2/3 flex flex-row justify-around px-4 py-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-[60%] flex-nowrap">
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot)}
                    {...provided.droppableProps}
                  >
                    {players.map((player, index) => (
                      <Draggable
                        key={player.PLAYER_ID}
                        draggableId={player.PLAYER_ID.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Card
                              id={player.PLAYER_ID.toString()}
                              name={player.PLAYER_NAME}
                              ppg=""
                              code={player.CODE}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </div>
        <section className="w-full">
          <div className="w-1/3 flex flex-row mx-auto items-center justify-center gap-8">
            <Button
              isDisabled={attempts === 0}
              onClick={resetToLastAttempt}
              className="p-6 bg-slate-300 border-[6px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850 hover:border-black"
            >
              Reset to last attempt
            </Button>
            <Button
              onClick={handleSubmitAttempt}
              className="p-6 bg-slate-300 border-[6px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850 hover:border-black"
            >
              Submit guess
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};
