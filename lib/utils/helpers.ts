import { secondsInHour } from 'date-fns/constants';
import { Chains } from '../types/asset';
import { YEAR_SECONDS } from '../values/general.values';
import type { AnyOffer } from '../types/offer';
import { getCurrentTime } from '../misc/web3';

/**
 *
 * @param address
 * @returns
 */
export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function sleep(timeMs = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeMs));
}

export function delay(fn: Function, delay = 500) {
  setTimeout(fn, delay);
}

export const placeholderPixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP88x8AAv0B/cfFKfIAAAAASUVORK5CYII=';

export function areArraysEqual(a1: any, a2: any, sorted = false) {
  if (!a1 || !a2 || !Array.isArray(a1) || !Array.isArray(a2) || a1.length !== a2.length) {
    return false;
  }

  if (sorted) {
    a1 = [...a1].sort();
    a2 = [...a2].sort();
  }

  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }

  return true;
}

/** Copy text to clipboard */
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      if (!window.$message) return;
      /* Resolved - text copied to clipboard successfully */
      if (window.$i18n?.te('dashboard.clipboard.copied')) {
        window.$message.success(window.$i18n.t('dashboard.clipboard.copied'));
      } else {
        window.$message.success('Text has been copied to clipboard');
      }
    },
    () => {
      if (!window.$message) return;
      /* Rejected - text failed to copy to the clipboard */
      if (window.$i18n?.te('dashboard.clipboard.error')) {
        window.$message.warning(window.$i18n.t('dashboard.clipboard.error'));
      } else {
        window.$message.warning('Failed to copy');
      }
    }
  );
}

export function copyToClipboardWithResponseTexts(text: string, successMsg?: string, errorMsg?: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      /* Resolved - text copied to clipboard successfully */
      if (successMsg) {
        window.$message.success(successMsg);
      } else {
        window.$message.success('Text has been copied to clipboard');
      }
    },
    () => {
      /* Rejected - text failed to copy to the clipboard */
      if (errorMsg) {
        window.$message.warning(errorMsg);
      } else {
        window.$message.warning('Failed to copy');
      }
    }
  );
}

export function formatPrice(price: number, currency = 'usd') {
  const decimals = Math.ceil(price) === price ? 0 : 2;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
  }).format(price);
}

export function contractLink(contractAddress?: string | null, chainId?: number): string {
  return contractAddress && chainId ? `${chainRpc(chainId)}address/${contractAddress}` : '';
}

export function transactionLink(transactionHash?: string | null, chainId?: number): string {
  return transactionHash && chainId ? `${chainRpc(chainId)}tx/${transactionHash}` : '';
}

export function chainRpc(chainId?: number): string {
  switch (chainId) {
    // case Chains.ETHEREUM:
    //   return 'https://etherscan.io/';
    // case Chains.SEPOLIA:
    //   return 'https://sepolia.etherscan.io/';
    case Chains.BASE:
      return 'https://base.blockscout.com/';
    case Chains.BASE_SEPOLIA:
      return 'https://sepolia-explorer.base.org/';
    case Chains.MOONBEAM:
      return 'https://moonbeam.moonscan.io/';
    case Chains.MOONBASE:
      return 'https://moonbase.moonscan.io/';
    default:
      console.warn('Missing chainId');
      return '';
  }
}

/**
 * Calculate interest rate
 * @param initialAmount
 * @param repayAmount
 * @param timeInYears
 * @returns
 */
export function calcAnnualInterestRate(initialAmount: number, repayAmount: number, timeInYears: number) {
  if (initialAmount <= 0) {
    console.error('Initial amount must be greater than zero.');
    return 0;
  }
  if (timeInYears <= 0) {
    console.error('Time in years must be greater than zero.');
    return 0;
  }

  return ((repayAmount - initialAmount) / (initialAmount * timeInYears)) * 100;
}

export function calcAnnualInterestRateWithSeconds(initialAmount: number, repayAmount: number, timeInSeconds: number) {
  if (timeInSeconds <= 0) {
    console.error('Time in seconds must be greater than zero.');
    return 0;
  }
  return calcAnnualInterestRate(initialAmount, repayAmount, timeInSeconds / YEAR_SECONDS);
}

export function calcRepayAmount(initialAmount: number, interestRate: number, timeInSeconds: number) {
  if (initialAmount <= 0) {
    console.error('Initial amount must be greater than zero.');
    return 0;
  }
  if (interestRate < 0) {
    console.error('Interest rate must be greater than zero.');
    return 0;
  }

  return initialAmount + initialAmount * (timeInSeconds / YEAR_SECONDS) * (interestRate / 10000);
}

export function calcLoanDuration(loan: AnyOffer) {
  if (loan.loanCreatedTime) {
    return getCurrentTime() - Math.floor(new Date(loan.loanCreatedTime).getTime() / 1000) + secondsInHour;
  }
  return loan.loanDuration + secondsInHour;
}
