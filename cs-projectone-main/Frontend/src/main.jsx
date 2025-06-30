import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryclient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryclient}>
        <App />
      </QueryClientProvider>
    </Router>
  </StrictMode>
);
