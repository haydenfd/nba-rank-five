import React, { useState, useEffect } from "react";
import { getItemStyle, getListStyle } from "../../Utils/drag";
import { Button } from "@nextui-org/react";
import { DropResult, DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card } from "./Card";
import { createSession } from "../../Api/Lib/Session";
import { CORRECT_GUESSES, MAX_ATTEMPTS } from "../../Utils/globals";

type AttemptsType = 0 | 1 | 2;

interface DragProps {
  playersList: any[]; 
  attempts: AttemptsType;
  handleAttempts: React.Dispatch<React.SetStateAction<AttemptsType>>;
}

export const Drag: React.FC<DragProps> = ({ playersList, attempts, handleAttempts }) => {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    setPlayers(playersList);
  }, [playersList]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const srcIndex = source.index;
    const destIndex = destination.index;

    const newPlayers = [...players];
    const [removed] = newPlayers.splice(srcIndex, 1);
    newPlayers.splice(destIndex, 0, removed);
    setPlayers(newPlayers);
  };

  const evaluateGuesses = async () => {
    try {
      const res = await fetch("https://nkc0fg59d8.execute-api.us-west-1.amazonaws.com/dev/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guesses: players.map((p) => p.PLAYER_ID),
          user_id: "123",
          attempts: attempts,
          solution: JSON.parse(localStorage.getItem("x") || "[]")
        }),
      });
  
      const data = await res.json();
      console.log("Guess evaluation result:", data);
  
    } catch (error) {
      console.error("Error evaluating guess:", error);
    }
  };

  const handleSubmitAttempt = async () => {
    handleAttempts((prev) => {
      if (prev < 3) {
        return (prev + 1) as AttemptsType;
      }
      return prev;
    });
    evaluateGuesses();
  };

  const startNewGame = async () => {
    const session = await createSession(localStorage.getItem("rank_five_user_id"));
    setPlayers(session.players);
  };

  return (
    <>
      <section className="mx-auto text-white text-xl font-medium my-2">
        Category: PPG
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
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <Card 
                              id={player.PLAYER_ID} 
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
          <div className="w-1/3 flex flex-row mx-auto items-center justify-center gap-14">
          <Button
              isDisabled={attempts === 0}
              className="p-6 bg-slate-300 border-[6px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850 hover:border-black"
            >
              Reset to last attempt
            </Button>          
            <Button
              onClick={
                attempts === MAX_ATTEMPTS || Number(JSON.parse(localStorage.getItem("rank_five_session_status") || "0")) !== 0
                  ? startNewGame
                  : handleSubmitAttempt
              }
              isDisabled={players.length !== CORRECT_GUESSES}
              className="p-6 bg-slate-300 border-[6px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850 hover:border-black"
            >
              Make guess
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};
