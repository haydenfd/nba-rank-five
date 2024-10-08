import React, { useState, useEffect } from "react";
import { getListStyle, getItemStyle } from "./DraggableUtils";
import { Button } from "@nextui-org/react";
import {
  initializeGame,
  resetGameState,
} from "../../Store/Snapshot/snapshotSlice";
import { PlayerDataInterface } from "../../Types/store";
import {
  DropResult,
  DragDropContext,
  Draggable,
  Droppable,
} from "react-beautiful-dnd";
import { Card } from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import {
  mutateGuesses,
  incrementAttempts,
} from "../../Store/Snapshot/snapshotSlice";
import { initializeNewSession } from "../../Api/Lib/Session";
import { resetGameLocalStorage } from "../../Utils/game";
import { MAX_ATTEMPTS } from "../../Utils/globals";

export const Drag = () => {
  const snap_players = useSelector(
    (state: RootState) => state.snapshot.players,
  );
  const attempts = useSelector((state: RootState) => state.snapshot.attempts);

  const dispatch = useDispatch();
  const [players, setPlayers] = useState<PlayerDataInterface[]>(snap_players);
  const [guesses, setGuesses] = useState<PlayerDataInterface[]>([]);

  useEffect(() => {
    if (snap_players && snap_players.length > 0) {
      setPlayers(snap_players);
    }
  }, [snap_players]);

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
      const sourceList =
        srcDroppableId === "droppable" ? [...players] : [...guesses];
      const destList =
        destDroppableId === "droppable" ? [...players] : [...guesses];
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

  const handleSubmitAttempt = async () => {
    // Increment attempts across store and local storage.
    // Do bounds checking here because useSelector is async.
    if (attempts < MAX_ATTEMPTS) {
      dispatch(incrementAttempts());
      localStorage.setItem(
        "rank_five_session_attempts",
        JSON.stringify(attempts + 1),
      );

      // maybe move the toast notif here? TODO: deal with toast issue.

      dispatch(mutateGuesses(guesses));
      localStorage.setItem("rank_five_last_guess", JSON.stringify(guesses));
    }
  };

  const startNewGame = async () => {
    const session = await initializeNewSession(
      localStorage.getItem("rank_five_user_id"),
    );
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
      <div className="w-full flex flex-col items-center space-y-10 mt-10">
        <div className="w-2/3 flex flex-row justify-around px-4 py-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-[40%] flex-nowrap">
              <div className="text-3xl font-bold text-white w-full text-center underline mb-4">
                PLAYERS
              </div>
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
                        draggableId={player.PLAYER_ID}
                        index={index}
                        // isDragDisabled = {isGameOver}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${false ? "pointer-events-none" : "pointer-events-auto"}`}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <Card
                              id={player.PLAYER_ID}
                              name={player.PLAYER_NAME}
                              ppg={String(player.PPG)}
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

            <div className="w-[40%] flex-nowrap">
              <div className="text-3xl font-bold text-white w-full text-center underline mb-4">
                GUESSES
              </div>
              <Droppable droppableId="droppable2">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot)}
                    {...provided.droppableProps}
                    className="flex-1"
                  >
                    {guesses.map((guess, index) => (
                      <Draggable
                        key={guess.PLAYER_ID}
                        draggableId={guess.PLAYER_ID}
                        index={index}
                        // isDragDisabled = {isGameOver}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${false ? "pointer-events-none" : "pointer-events-auto"}`}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <Card
                              id={guess.PLAYER_ID}
                              name={guess.PLAYER_NAME}
                              ppg={String(guess.PPG)}
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
              onClick={
                attempts === MAX_ATTEMPTS ||
                Number(
                  JSON.parse(
                    localStorage.getItem("rank_five_session_status") || "0",
                  ),
                ) !== 0
                  ? startNewGame
                  : handleSubmitAttempt
              }
              // isDisabled={!(guesses.length === 5)}
              className="p-6 bg-slate-300 border-[6px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850  hover:border-black"
            >
              {attempts === MAX_ATTEMPTS ||
              Number(
                JSON.parse(
                  localStorage.getItem("rank_five_session_status") || "0",
                ),
              ) !== 0
                ? "Start New Game"
                : "Submit"}
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};
