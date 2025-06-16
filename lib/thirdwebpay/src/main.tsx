import React from 'react';
import ReactDOM from 'react-dom/client';
import ThirdwebPay, { type Params } from './ThirdwebPay.tsx';

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

  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <ThirdwebPay {...options} />
    </React.StrictMode>
  );
}

// startThirdwebPayment('#thirdwebpay', {
//   clientId: '0306ad941df0dd10deef7686668f3ad6',
//   amountInUsdc: '0.01',
//   onSuccess: (info: any) => {
//     console.log(info);
//   },
// });
