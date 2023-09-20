/**
 * Formats the number honouring the locale
 */
export function toLocaleFixed(amount: number | undefined, fractionDigits = 1): string {
    if (amount === undefined || isNaN(amount)) {
        return (0)
            .toLocaleString(undefined, {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
            })
            .replace(/0/g, "-");
    }

    return amount.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    });
}
