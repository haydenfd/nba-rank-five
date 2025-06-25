import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Main } from "./Pages/Main";
import { Providers } from "./Providers/providers";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Providers>
    <Main />
  </Providers>,
);
