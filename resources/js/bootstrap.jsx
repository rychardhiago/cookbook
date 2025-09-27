// resources/js/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app"; // importa o export default de app.jsx
import "../css/app.css";

ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
