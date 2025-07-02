import React from 'react';
import ReactDOM from 'react-dom/client';
import ThirdwebPay, { type Params } from './ThirdwebPay.tsx';

let root: ReactDOM.Root | null = null;

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

  if (!root) {
    root = ReactDOM.createRoot(el);
  }

  root.render(
    <React.StrictMode>
      <ThirdwebPay {...options} />
    </React.StrictMode>
  );
}

// startThirdwebPayment('#thirdwebpay', {
//   clientId: '0306ad941df0dd10deef7686668f3ad6',
//   paymentReceiverAddress: '0xf2BBEDd9aE53eFb9CaA13D16E12dF1d2Ba8B0401',
//   testMode: true,
//   amountInUsdc: '0.1',
//   onSuccess: (info: any) => {
//     console.log(info);
//   },
// });
