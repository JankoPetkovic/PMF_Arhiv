import './bootstrap';
import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import '../css/app.css';
import { GlobalniProvider } from './Konteksti';

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Stranice/**/*.jsx', { eager: true })
    return pages[`./Stranice/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <React.StrictMode>
        <GlobalniProvider>
          <App {...props} />
        </GlobalniProvider>
      </React.StrictMode>
    );
  },
});
