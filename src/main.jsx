import React from "react";
import { createRoot } from "react-dom/client";


// Contexts 
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

// App component
import App from "./App.jsx";  // <-- This is your main React component

// Styles
import "./App.css";    // <-- Just import for styles

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
    
          <App />
        
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);
