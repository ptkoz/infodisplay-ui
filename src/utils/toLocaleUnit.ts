import { toLocaleFixed } from "./toLocaleFixed";

/**
 * Displays value with currency
 */
export function toLocaleUnit(amount: number | undefined, unit: string, fractionDigits?: number): string {
    return toLocaleFixed(amount, fractionDigits) + "\u00A0" + unit;
}
