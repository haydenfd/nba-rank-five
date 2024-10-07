import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./fonts.css";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import { Main } from "./Pages/Main";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <NextUIProvider>
    <Provider store={store}>
      <Main />
    </Provider>
  </NextUIProvider>,
);
