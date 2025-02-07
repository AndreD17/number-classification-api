import express from "express";
import axios from "axios";
import cors from "cors";
import compression from "compression";
import NodeCache from "node-cache";
import { checkPrime, checkPerfect, checkArmstrong, getDigitsSum, classifyProperties } from "./src/utils.js";

const app = express();
const PORT = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 86400 }); // Cache responses for 24 hours
const externalCache = new NodeCache({ stdTTL: 86400 }); // External API Cache

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Fetch fun fact from Numbers API (with caching)
const fetchFunFact = async (num, isArmstrong) => {
    const cacheKey = `funFact-${num}`;
    const cachedData = externalCache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        const [numbersApiResponse, wikipediaResponse] = await Promise.all([
            axios.get(`http://numbersapi.com/${num}?json`).then(res => res.data.text),
            axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/Parity_(mathematics)")
                .then(res => res.data.extract)
                .catch(() => "")
        ]);

        let funFact = numbersApiResponse;
        if (isArmstrong) {
            funFact += ` It is an Armstrong number.`;
        } else {
            funFact += wikipediaResponse ? ` ${wikipediaResponse}` : "";
        }

        externalCache.set(cacheKey, funFact);
        return funFact;
    } catch {
        return "No fun fact available.";
    }
};

// Number classification API
app.get("/api-classify-number", async (req, res) => {
    const { number } = req.query;

    if (!number || !/^-?\d+$/.test(number)) {
        return res.status(400).json({
            number: number || null,
            error: true,
        });
    }

    const num = parseInt(number, 10);

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
    const properties = classifyProperties(num, isArmstrong ? "armstrong" : null);

    // Fetch data in parallel
    try {
        const funFact = await fetchFunFact(num, isArmstrong);

        const responseData = {
            number: num,
            is_prime: isPrime,
            is_perfect: isPerfect,
            properties,
            digit_sum: digitSum,
            fun_fact: funFact,
        };

        // Store response in cache
        cache.set(num, responseData);
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch external data" });
    }
});

// Catch-all Route for Invalid URLs
app.use((req, res) => {
    res.status(400).json({ error: true, message: "Invalid request. Check the endpoint and parameters." });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
