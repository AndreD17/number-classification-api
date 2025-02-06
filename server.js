import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

app.get("/api-classify-number", async (req, res) => {
    const { n } = req.query;

    if (!n || isNaN(n)) {
        return res.status(400).json({
            number: n,
            error: true,
        });
    }

    const num = parseInt(n, 10);

    // Check number properties
    const isPrime = checkPrime(num);
    const isPerfect = checkPerfect(num);
    const isArmstrong = checkArmstrong(num);
    const digitSum = getDigitsSum(num);
    const properties = classifyProperties(num, isArmstrong);

    try {
        const funFact = await fetchFunFact(num);
        const parityInfo = await checkParityInfo(num);

        res.json({
            number: num,
            is_prime: isPrime,
            is_perfect: isPerfect,
            is_armstrong: isArmstrong,
            properties,
            digit_sum: digitSum,
            fun_fact: funFact,
            parity_info: parityInfo,
        });
    } catch (error) {
        res.status(500).json({
            error: "Unable to fetch fun fact",
        });
    }
});

// Check if number is prime
function checkPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

// Check if number is perfect
function checkPerfect(n) {
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            sum += i + (i !== n / i ? n / i : 0);
        }
    }
    return sum === n && n !== 1;
}

// Check if number is an Armstrong number
function checkArmstrong(n) {
    const digits = n.toString().split("");
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(parseInt(digit), power), 0);
    return sum === n;
}

// Calculate sum of digits
function getDigitsSum(n) {
    return n.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
}

// Determine properties of number
function classifyProperties(n, isArmstrong) {
    let properties = [];
    if (isArmstrong) properties.push("armstrong");
    properties.push(n % 2 === 0 ? "even" : "odd");
    properties.push(n >= 1 ? "positive" : "negative");
    return properties;
}

// Fetch fun fact from Numbers API
async function fetchFunFact(n) {
    try {
        const response = await axios.get(`http://numbersapi.com/${n}`);
        return response.data;
    } catch (error) {
        return "No fun fact available.";
    }
}

// Fetch parity information from Wikipedia API
async function checkParityInfo(n) {
    try {
        const response = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/Parity_(mathematics)`
        );
        return response.data.extract || "No parity information available.";
    } catch (error) {
        return "No parity information available.";
    }
}

app.listen(PORT, () => {
    console.log(`Server is listening on port Http://Localhost:${PORT}`);
});
