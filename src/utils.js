// Check if a number is prime 
export const checkPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
        if (num % i === 0) return false;
    }
    return true;
};


// Check if a number is perfect
export const checkPerfect = (num) => {
    if (num < 2) return false;
    let sum = 1;
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
        if (num % i === 0) {
            sum += i + (i !== num / i ? num / i : 0);
        }
    }
    return sum === num;
};

// Check if a number is an Armstrong number
export const checkArmstrong = (num) => {
    const digits = num.toString().split("");
    const power = digits.length;
    return digits.reduce((sum, digit) => sum + Math.pow(parseInt(digit), power), 0) === num;
};

// Calculate sum of digits
export const getDigitsSum = (num) => {
    return num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0); //
};

// Determine properties of a number
export const classifyProperties = (num, isArmstrong) => {
    // Create an array of properties based on conditions
    const properties = [
        isArmstrong ? "armstrong" : null,
        num % 2 === 0 ? "even" : "odd"
    ];

    // Filter out any null values (or false values)
    return properties.filter(Boolean);
};