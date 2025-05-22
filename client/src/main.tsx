import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize the Telegram WebApp SDK
const script = document.createElement("script");
script.src = "https://telegram.org/js/telegram-web-app.js";
script.async = true;
script.onload = () => {
  // Only render the app after the Telegram script has loaded
  createRoot(document.getElementById("root")!).render(<App />);
};

document.head.appendChild(script);
