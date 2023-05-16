import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/dashboard.css";
import "./styles/map.css";
import "leaflet/dist/leaflet.css";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
