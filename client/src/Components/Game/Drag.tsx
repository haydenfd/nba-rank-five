import React, { useState, useEffect } from "react";
import { getItemStyle, getListStyle } from "../../Utils/drag";
import { Button } from "@nextui-org/react";
import { DropResult, DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card } from "./Card";
import { useDispatch } from "react-redux";
import { mutateGuesses, initializeGame, resetGameState } from "../../Store/snapshotSlice";
import { createSession } from "../../Api/Lib/Session";
import { resetGameLocalStorage } from "../../Utils/game";
import { CORRECT_GUESSES, MAX_ATTEMPTS } from "../../Utils/globals";
import { GuessCrumbs } from "./GuessCrumbs";

type AttemptsType = 0 | 1 | 2;

interface DragProps {
  playersList: any[]; // TODO: amend
  attempts: AttemptsType;
  handleAttempts: React.Dispatch<React.SetStateAction<AttemptsType>>;
}

export const Drag: React.FC<DragProps> = ({ playersList, attempts, handleAttempts }) => {

  const dispatch = useDispatch();
  const [players, setPlayers] = useState<any[]>([]);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [lastGuess, setLastGuess] = useState<any[]>([]);
  useEffect(() => {
    console.log('Wow')
    console.log(playersList)
    setPlayers(playersList);
  }, [playersList]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const srcIndex = source.index;
    const destIndex = destination.index;
    const srcDroppableId = source.droppableId;
    const destDroppableId = destination.droppableId;

    if (srcDroppableId === destDroppableId) {
      const list = srcDroppableId === "droppable" ? [...players] : [...guesses];
      const [removed] = list.splice(srcIndex, 1);
      list.splice(destIndex, 0, removed);
      srcDroppableId === "droppable" ? setPlayers(list) : setGuesses(list);
    } else {
      const sourceList = srcDroppableId === "droppable" ? [...players] : [...guesses];
      const destList = destDroppableId === "droppable" ? [...players] : [...guesses];
      const [removed] = sourceList.splice(srcIndex, 1);
      destList.splice(destIndex, 0, removed);

      if (srcDroppableId === "droppable") {
        setPlayers(sourceList);
        setGuesses(destList);
      } else {
        setPlayers(destList);
        setGuesses(sourceList);
      }
    }
  };

  const evaluateGuesses = async () => {
    console.log(guesses.map((g) => g.PLAYER_ID))
    console.log(JSON.parse(localStorage.getItem("x") || "[]"))
    try {
      const res = await fetch("https://nkc0fg59d8.execute-api.us-west-1.amazonaws.com/dev/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guesses: guesses.map((g) => g.PLAYER_ID),  // <-- your guesses array
          user_id: "123",             // <-- from localStorage or your app state
          attempts: 2,                              // <-- current attempt number
          solution: JSON.parse(localStorage.getItem("x") || "[]") // <-- TEMPORARY: only needed for now if solution is still being passed manually
        }),
      });
  
      const data = await res.json();
      console.log("YOU got 3 correct:", data);
  
      // data will have:
      // data.scores = [1, 0, 0, 0, 0, 1]
      // data.result = 0 / 1 / 2 (active / win / loss)
  
    } catch (error) {
      console.error("Error evaluating guess:", error);
    }
  };
  const incrementAttempts = () => {
    handleAttempts((prev) => {
      if (prev < 3) {
        return (prev + 1) as AttemptsType;
      }
      return prev;
    });
  };

  const handleSubmitAttempt = async () => {
    // increment attempts
    // send to lambda for evaluating the guess
    // prepare the guess list.
    const guesses_ids = guesses.map((player) => player.PLAYER_ID);
    setLastGuess([...guesses]);
    console.log(guesses_ids);
    evaluateGuesses();
  };

  const startNewGame = async () => {
    const session = await createSession(localStorage.getItem("rank_five_user_id"));
    resetGameLocalStorage(session.session_id);
    dispatch(resetGameState());
    setGuesses([]);

    dispatch(
      initializeGame({
        players: session.players,
      }),
    );
  };

  return (
    <>
      <section className="mx-auto text-white text-xl font-medium my-2">
        Category: PPG
      </section>
      <section className="mx-auto text-white text-xl font-medium my-2">
        Attempts left: {3 - attempts}
      </section>
      <section>
        <GuessCrumbs guesses={lastGuess} isVisible={true}/>
      </section>
      <div className="w-full flex flex-col items-center space-y-10 mt-6">
        <div className="w-2/3 flex flex-row justify-around px-4 py-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-[30%] flex-nowrap">
              {/* <div className="text-2xl font-bold  w-full text-center mb-6 py-1 bg-white text-slate-800 border-2 border-black">PLAYERS</div> */}
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot)} {...provided.droppableProps}>
                    {players.map((player, index) => (
                      <Draggable
                        key={player.PLAYER_ID}
                        draggableId={player.PLAYER_ID.toString()}
                        index={index}
                        // isDragDisabled = {isGameOver}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${false ? "pointer-events-none" : "pointer-events-auto"}`}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <Card id={player.PLAYER_ID} name={player.PLAYER_NAME} ppg="" code={player.CODE}/>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="w-[30%] flex-nowrap">
              <Droppable droppableId="droppable2">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot)} {...provided.droppableProps} className="flex-1">
                    {guesses.map((guess, index) => (
                      <Draggable
                        key={guess.PLAYER_ID}
                        draggableId={guess.PLAYER_ID.toString()}
                        index={index}
                        // isDragDisabled = {isGameOver}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${false ? "pointer-events-none" : "pointer-events-auto"}`}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <Card id={guess.PLAYER_ID} name={guess.PLAYER_NAME} ppg="" code={guess.CODE}/>
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
              onClick={
                attempts === MAX_ATTEMPTS || Number(JSON.parse(localStorage.getItem("rank_five_session_status") || "0")) !== 0
                  ? startNewGame
                  : handleSubmitAttempt
                }
              isDisabled={!(guesses.length === CORRECT_GUESSES)}
              className="p-6 bg-slate-300 border-[6px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850  hover:border-black"
            >
              {attempts === MAX_ATTEMPTS || Number(JSON.parse(localStorage.getItem("rank_five_session_status") || "0")) !== 0
                ? "Start New Game"
                : "Submit"}
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};
