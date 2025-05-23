import React from 'react';
import { createRoot } from 'react-dom/client';
import ThirdwebPay, { Params } from './ThirdwebPay';

export function startThirdwebPayment(selector: string, options: Params) {
  if (typeof document === 'undefined' || !selector) {
    console.error('Cannot initialize react app');
    return;
  }

  const el = document.querySelector(selector);

  if (!el) {
    console.error('Cannot initialize react app (no element)');
    return;
  }

  createRoot(el).render(
    <React.StrictMode>
      <ThirdwebPay {...options} />
    </React.StrictMode>
  );
}
