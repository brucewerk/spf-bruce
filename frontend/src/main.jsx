import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // ← Mudar de './styles/index.css' para './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
