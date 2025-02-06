import express from "express";
import axios from "axios";
import cors from "cors";
import compression from "compression";
import NodeCache from "node-cache";
import { checkPrime, checkPerfect, checkArmstrong, getDigitsSum, classifyProperties } from "./src/utils.js";

const app = express();
const PORT = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 86400 }); // Cache responses for 24 hours

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Middleware to validate number input
const validateNumber = (req, res, next) => {
    const { n } = req.query;
    if (!n || !/^-?\d+$/.test(n)) {
        return res.status(400).json({
            error: true,
            message: "Invalid input. Only integers are allowed.",
        });
    }    
    next();
};

// Cache for external API responses
const externalCache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

// Fetch fun fact from Numbers API (with caching)
const fetchFunFact = async (n) => {
    const cacheKey = `funFact-${n}`;
    const cachedData = externalCache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await axios.get(`http://numbersapi.com/${n}`);
        externalCache.set(cacheKey, response.data);
        return response.data;
    } catch {
        return "No fun fact available.";
    }
};

// Fetch parity information from Wikipedia API (with caching)
const fetchParityInfo = async () => {
    const cacheKey = "parityInfo";
    const cachedData = externalCache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await axios.get(
            "https://en.wikipedia.org/api/rest_v1/page/summary/Parity_(mathematics)"
        );
        const parityInfo = response.data.extract || "No parity information available.";
        externalCache.set(cacheKey, parityInfo);
        return parityInfo;
    } catch {
        return "No parity information available.";
    }
};

app.get("/api-classify-number", validateNumber, async (req, res) => {
    const num = req.num;

    // Check cache first
    const cachedData = cache.get(num);
    if (cachedData) {
        return res.json(cachedData);
    }

    // Perform calculations
    const isPrime = checkPrime(num);
    const isPerfect = checkPerfect(num);
    const isArmstrong = checkArmstrong(num);
    const digitSum = getDigitsSum(num);
    const properties = classifyProperties(num, isArmstrong);

    // Fetch data in parallel
    try {
        const [funFact, parityInfo] = await Promise.all([
            fetchFunFact(num),
            fetchParityInfo()
        ]);

        const responseData = {
            number: num,
            is_prime: isPrime,
            is_perfect: isPerfect,
            is_armstrong: isArmstrong,
            properties,
            digit_sum: digitSum,
            fun_fact: funFact,
            parity_info: parityInfo,
        };

        // Store response in cache
        cache.set(num, responseData);
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch external data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});