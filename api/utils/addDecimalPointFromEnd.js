export function addDecimalPointFromEnd(amount, decimals) {
    if (decimals === 0) return amount
    // Ensure the amount is a string
    let number = amount.toString();

    // If decimals are greater than or equal to the length of the number, add leading zeros
    if (decimals >= number.length) {
        number = number.padStart(decimals + 1, "0");
    }

    // Insert the decimal point at the correct position
    const decimalPosition = number.length - decimals;
    const formattedNumber = number.slice(0, decimalPosition) + "." + number.slice(decimalPosition);

    return formattedNumber;
}