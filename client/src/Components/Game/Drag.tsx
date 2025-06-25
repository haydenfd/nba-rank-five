import React, { useState, useCallback } from "react";
import { getItemStyle, getListStyle } from "./DragDropConfigs";
import { Button, useDisclosure } from "@heroui/react";
import { DropResult, DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { PlayerCard } from "../PlayerCard/Card";
import { useGameContext } from "../../Context/GameContext";
import { apiClient } from "../../Api/axiosClient";
import { SolutionModal } from "../Modals/SolutionModal";
import { addToast, ToastProvider } from "@heroui/toast";

const categoryLabels: Record<string, string> = {
  GP: "Games Played",
  PPG: "Points Per Game",
  APG: "Assists Per Game",
  RPG: "Rebounds Per Game",
};

export const Drag: React.FC = () => {
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false);

  const { isOpen: isSolutionModalOpen, onOpen: openSolutionModal, onOpenChange: onSolutionModalChange } = useDisclosure();

  const { players, category, attempts, lastGuessesCorrect, solution, resetToLastGuessAttempt, setGameState } = useGameContext();

  const evaluateGuesses = async (): Promise<{
    sessionResult: string;
    lastGuessesAttempt: number[];
    lastGuessesCorrect: number;
    solution?: number[];
    attempts: 0 | 1 | 2 | 3;
  }> => {
    const { data } = await apiClient.post<{
      sessionResult: string;
      lastGuessesAttempt: number[];
      lastGuessesCorrect: number;
      solution?: number[];
      attempts: 0 | 1 | 2 | 3;
    }>(
      "/evaluate-guess",
      {
        user_id: localStorage.getItem("__ranked_user_id") || "",
        attempts: attempts + 1,
        guesses: players.map(player => player.PLAYER_ID),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return data;
  };

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const updatedPlayers = [...players];
    const [removed] = updatedPlayers.splice(source.index, 1);
    updatedPlayers.splice(destination.index, 0, removed);
    setGameState({ players: updatedPlayers });
  }, [players, setGameState]);


  const handleSubmitAttempt = async () => {
    setIsLoadingState(true);
    const { attempts, lastGuessesAttempt, lastGuessesCorrect, sessionResult, solution } = await evaluateGuesses();
    setIsLoadingState(false);

    if (sessionResult === "WON" || sessionResult === "LOST") {
      setGameState({
        attempts,
        lastGuessesAttempt,
        lastGuessesCorrect,
        solution,
      });
      openSolutionModal();
    } else {
      setGameState({
        attempts,
        lastGuessesAttempt,
        lastGuessesCorrect,
      });

      addToast({
        description: `You got ${lastGuessesCorrect} guesses right`,
        variant: "flat",
        timeout: 2500,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  return (
    <>

      <section className="mx-auto text-white text-xl font-medium my-2">Category: {categoryLabels[category] ?? category}</section>
      <section className="mx-auto text-white text-xl font-medium my-2">Attempts left: {3 - attempts}</section>
      <section className="mx-auto text-white text-xl font-medium my-2 min-h-[1.5rem]">
        {lastGuessesCorrect !== null ? (
          <>Last attempt: {lastGuessesCorrect} correct</>
        ) : (
          <>&nbsp;</> // placeholder to preserve height
        )}
      </section>
      <div className="w-full flex flex-col items-center space-y-10 mt-6">
        <div className="w-2/3 flex flex-row justify-around px-4 py-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-[60%] flex-nowrap">
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot)} {...provided.droppableProps}>
                    {players.map((player, index) => (
                      <Draggable key={player.PLAYER_ID} draggableId={player.PLAYER_ID.toString()} index={index} isDragDisabled={!!solution}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <PlayerCard id={player.PLAYER_ID.toString()} name={player.PLAYER_NAME} ppg="" code={player.CODE} />
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
            {solution ? (
              <>
                <Button
                  onPress={openSolutionModal}
                  className="p-6 bg-slate-300 border-[4px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850 hover:border-black"
                >
                  See solution
                </Button>
                <Button
                  onPress={() => window.location.reload()}
                  className="p-6 bg-slate-300 border-[4px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850 hover:border-black"
                >
                  Start new game
                </Button>
              </>
            ) : (
              <>
                <Button
                  isDisabled={attempts === 0 || isLoadingState}
                  isLoading={isLoadingState}
                  onPress={resetToLastGuessAttempt}
                  className="p-6 bg-slate-300 border-[4px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850 hover:border-black"
                >
                  Reset to last attempt
                </Button>
                <Button
                  isDisabled={isLoadingState}
                  isLoading={isLoadingState}
                  onPress={handleSubmitAttempt}
                  className="p-6 bg-slate-300 border-[4px] border-slate-700 text-slate-700 text-lg rounded-none font-bold hover:bg-slate-850 hover:border-black"
                >
                  Submit guess
                </Button>
              </>
            )}
          </div>
        </section>

      </div>
      <SolutionModal isOpen={isSolutionModalOpen} onOpenChange={onSolutionModalChange} result={"LOST"} />
      <ToastProvider />
    </>
  );
};
