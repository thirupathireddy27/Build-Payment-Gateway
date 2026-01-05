// Validate VPA format
const validateVPA = (vpa) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return regex.test(vpa);
};

// Luhn Algorithm
const validateLuhn = (cardNumber) => {
    if (!cardNumber) return false;
    // Remove spaces and dashes
    const cleanNum = cardNumber.replace(/[\s-]/g, '');

    // Verify digits only and length
    if (!/^\d{13,19}$/.test(cleanNum)) return false;

    let sum = 0;
    let shouldDouble = false; // Start from rightmost, first digit is NOT doubled (it's the check digit essentially if we view it that way, but algorithm says: double every second digit from right)
    // Loop from right to left
    for (let i = cleanNum.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNum.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return (sum % 10) === 0;
};

// Card Network Detection
const getCardNetwork = (cardNumber) => {
    if (!cardNumber) return 'unknown';
    const cleanNum = cardNumber.replace(/[\s-]/g, '');

    // Visa: Starts with 4
    if (/^4/.test(cleanNum)) return 'visa';

    // Mastercard: 51-55
    if (/^5[1-5]/.test(cleanNum)) return 'mastercard';

    // Amex: 34, 37
    if (/^3[47]/.test(cleanNum)) return 'amex';

    // RuPay: 60, 65, 81-89
    if (/^60|^65|^8[1-9]/.test(cleanNum)) return 'rupay';

    return 'unknown';
};

// Expiry Validation
const validateExpiry = (month, year) => {
    const m = parseInt(month, 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed

    let y = parseInt(year, 10);

    // Handle 2 digit year
    if (y < 100) y += 2000;

    if (m < 1 || m > 12) return false;

    if (y < currentYear) return false;
    if (y === currentYear && m < currentMonth) return false;

    return true;
};

module.exports = {
    validateVPA,
    validateLuhn,
    getCardNetwork,
    validateExpiry
};
