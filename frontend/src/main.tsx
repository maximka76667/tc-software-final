// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { closeSnackbar, SnackbarProvider } from "notistack";
import { IoMdClose } from "react-icons/io";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <SnackbarProvider
    action={(snackbarId) => (
      <button
        type="button"
        title="Close"
        style={{ backgroundColor: "transparent" }}
        onClick={() => closeSnackbar(snackbarId)}
      >
        <IoMdClose />
      </button>
    )}
    maxSnack={10}
  >
    <App />
  </SnackbarProvider>
  // </StrictMode>
);
