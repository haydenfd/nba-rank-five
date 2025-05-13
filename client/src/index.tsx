import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
// import { Provider } from "react-redux";
// import { store } from "./Store/store";
import { Main } from "./Pages/Main";
import { StatsContextProvider } from "./Context/StatsContext";
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <NextUIProvider>
    <StatsContextProvider>
      <Main />
    </StatsContextProvider>
  </NextUIProvider>,
);
