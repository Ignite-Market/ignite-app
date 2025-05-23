import React from 'react';
import ReactDOM from 'react-dom/client';
import ThirdwebPay from './ThirdwebPay';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThirdwebPay
      clientId="cb9fdd79dc90a00bb25834371066f31b"
      amountInUsdc="5"
      // testMode
      // tokenAddress="0x5deac602762362fe5f135fa5904351916053cf70"
      // tokenAddress="0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
    />
  </React.StrictMode>
);
