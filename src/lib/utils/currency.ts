/**
 * Format price in Indian Rupees
 * @param amount - Price amount as number
 * @param showDecimals - Whether to show decimal places (default: true)
 */
export function formatPrice(amount: number, showDecimals: boolean = true): string {
  if (showDecimals) {
    return `₹${amount.toFixed(2)}`;
  } else {
    // Only show decimals if not a whole number
    return amount % 1 === 0 ? `₹${amount.toLocaleString('en-IN')}` : `₹${amount.toFixed(2)}`;
  }
}

/**
 * Format price with Indian number system (lakhs/crores)
 */
export function formatPriceIndian(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
