import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const initApp = () => {
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("No se encontró el elemento root en el DOM");
    }

    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);

    const initialLoading = document.querySelector(".initial-loading");
    if (initialLoading) {
      initialLoading.remove();
    }

    // Error handling
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: white;
          padding: 1rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="
            max-width: 28rem;
            width: 100%;
            padding: 1.5rem;
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            text-align: center;
          ">
            <div style="
              width: 4rem;
              height: 4rem;
              background-color: #fee2e2;
              border-radius: 9999px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1rem auto;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 style="
              font-size: 1.25rem;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 0.5rem;
            ">Ha ocurrido un error</h2>
            <p style="
              color: #4b5563;
              margin-bottom: 1.5rem;
            ">No se pudo iniciar la aplicación. Por favor, recarga la página o intenta más tarde.</p>
            <button onclick="window.location.reload()" style="
              background-color: #3b82f6;
              color: white;
              font-weight: 500;
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              border: none;
              width: 100%;
              cursor: pointer;
              transition: background-color 0.2s;
            ">Recargar página</button>
          </div>
        </div>
      `;
    }
  }
};

// Inicializar la aplicación
initApp();
