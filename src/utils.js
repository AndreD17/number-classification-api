// Check if a number is prime
export const checkPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2, sqrt = Math.sqrt(n); i <= sqrt; i++) {
        if (n % i === 0) return false;
    }
    return true;
};

// Check if a number is perfect
export const checkPerfect = (n) => {
    let sum = 1;
    for (let i = 2, sqrt = Math.sqrt(n); i <= sqrt; i++) {
        if (n % i === 0) {
            sum += i + (i !== n / i ? n / i : 0);
        }
    }
    return sum === n && n !== 1;
};

// Check if a number is an Armstrong number
export const checkArmstrong = (n) => {
    const digits = n.toString().split("");
    const power = digits.length;
    return digits.reduce((sum, digit) => sum + Math.pow(parseInt(digit), power), 0) === n;
};

// Calculate sum of digits
export const getDigitsSum = (n) => {
    return n.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
};

// Determine properties of a number
export const classifyProperties = (n, isArmstrong) => {
    return [
        isArmstrong ? "armstrong" : null,
        n % 2 === 0 ? "even" : "odd",
        n >= 0 ? "positive" : "negative",
    ].filter(Boolean);
};
