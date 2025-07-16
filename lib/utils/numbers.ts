import { parseUnits } from 'viem';
import { DISPLAY_DECIMALS } from '../values/general.values';

export const randomNumbers = (count: number): number => {
  return Math.floor(Math.random() * 10 ** count);
};

export const randomBigInt = (count: number): bigint => {
  return BigInt(Math.floor(Math.random() * 10 ** count));
};

/**
 *  Format numbers
 */
export function numToBigInt(input: number, decimals: number = 18) {
  return BigInt(parseUnits(input.toString(), decimals));
}

export function bigIntToNum(input: bigint | string | number, decimals: number = 18) {
  return Number(input) / Math.pow(10, decimals);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * min/max inclusive
 */
export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isNumeric(n: any): n is number | string {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function intVal(n: number | string): number {
  return typeof n === 'number' ? n : parseInt(n, 10);
}

export function floorNumber(num: number, decimals: number = DISPLAY_DECIMALS) {
  const factor = Math.pow(10, decimals);

  // Ignore tiny dust balances – treat anything smaller than 1 / factor as 0
  if (num < 1 / factor) {
    return 0;
  }

  // Floor so we never show a value the user cannot actually sell
  return Math.floor(num * factor) / factor;
}

/**
 * To fixed and back to number to remove decimal when 0. eg 10.00 -> 10
 */
export function getFixed(num: number | string, places = 2, round = false, roundToDecimals = false) {
  if (!num) {
    num = 0;
  }

  if (typeof num !== 'number') {
    num = parseFloat(num);
  }

  if (roundToDecimals) {
    num = Math.floor(num * 10 * Math.pow(10, places)) / (10 * Math.pow(10, places));
  } else if (round) {
    return Math.round(num);
  }

  if (!places) {
    places = 0;
  }

  return parseFloat(num.toFixed(places));
}

export function formatCollateralAmount(
  num: bigint | number | string,
  collateralDecimals: number,
  decimals: number = 3
) {
  return formatNumber(+(Number(num) / Math.pow(10, collateralDecimals)).toFixed(decimals));
}

export function shortenLargeNumber(value: number | string, decimals = 2) {
  if (typeof value === 'string') {
    value = +value;
  }

  if (isNaN(value)) {
    return value;
  }

  if (value > 1000000) {
    return `${getFixed(value / 1000000, 3, false, true)}M`;
  } else if (value > 10000) {
    return `${getFixed(value / 1000, 2, false, true)}K`;
  }

  return `${getFixed(value, decimals)}`;
}
