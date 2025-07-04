import './bootstrap';
import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import '../css/app.css';
import { GlobalniProvider } from './Konteksti';
import { ToastContainer } from 'react-toastify';

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
          <ToastContainer   
                position="bottom-right"
                autoClose={5000}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </GlobalniProvider>
      </React.StrictMode>
    );
  },
});
