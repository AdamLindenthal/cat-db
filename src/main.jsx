import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/special-elite/400.css';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/600.css';
import '@fontsource/gochi-hand/400.css';
import './index.css';
import App from './App';
import { StoreProvider } from './store';
import { LangProvider } from './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <LangProvider>
    <StoreProvider>
      <App />
    </StoreProvider>
  </LangProvider>
);
