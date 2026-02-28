// gstUtils.js
// Utility functions for GST-inclusive pricing (Restaurant @ 5%)

const GST_RATE = 0.05; // 5% GST for restaurant services
const CGST_RATE = 0.025;
const SGST_RATE = 0.025;

/**
 * Round to 2 decimals using bankers-safe rounding
 */
function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Extract GST components from a GST-inclusive price.
 *
 * @param {number} grossAmount - Final price charged to customer (GST included)
 * @returns {object}
 */
function extractGST(grossAmount) {
  if (typeof grossAmount !== "number") {
    throw new Error("grossAmount must be a number");
  }

  // Back-calculate taxable value
  const taxableValue = grossAmount / (1 + GST_RATE);

  // GST amount is the difference
  const totalGST = grossAmount - taxableValue;

  // Split GST
  const cgst = totalGST / 2;
  const sgst = totalGST / 2;

  return {
    grossAmount: round2(grossAmount),
    taxableValue: round2(taxableValue),
    gstAmount: round2(totalGST),
    cgst: round2(cgst),
    sgst: round2(sgst),
    gstRate: GST_RATE
  };
}

/**
 * Calculate invoice totals for multiple line items
 *
 * @param {Array<{price:number, qty:number, name:string}>} items
 */
function calculateInvoice(items) {
  let grossTotal = 0;

  const lineItems = items.map(item => {
    const lineGross = item.price * item.qty;
    const gstData = extractGST(lineGross);

    grossTotal += lineGross;

    return {
      name: item.name,
      qty: item.qty,
      unitPrice: item.price,
      ...gstData
    };
  });

  const summary = extractGST(grossTotal);

  return {
    items: lineItems,
    summary
  };
}

module.exports = {
  extractGST,
  calculateInvoice
};
