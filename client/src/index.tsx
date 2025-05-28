import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { Main } from "./Pages/Main";
import { StatsContextProvider } from "./Context/StatsContext";
import { GameProvider } from "./Context/GameContext";
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <NextUIProvider>
    <StatsContextProvider>
      <GameProvider>
        <Main />
      </GameProvider>
    </StatsContextProvider>
  </NextUIProvider>,
);
