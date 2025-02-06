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
    const { n } = req.query; // 

    // Check if n is not provided or it's not an integer
    if (!n || !/^-?\d+$/.test(n)) {
        return res.status(400).json({
            number: n || null,
            error: true,
        });
    }
    req.num = parseInt(n, 10);
    next();
};

// Cache for external API responses
const externalCache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

// Fetch fun fact from Numbers API (with caching)
const fetchFunFact = async (n, isArmstrong) => {
    const cacheKey = `funFact-${n}`;
    const cachedData = externalCache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        // Fetch both API responses in parallel
        const [numbersApiResponse, wikipediaResponse] = await Promise.all([
            axios.get(`http://numbersapi.com/${n}?json`).then(res => res.data.text),
            axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/Parity_(mathematics)")
                .then(res => res.data.extract)
                .catch(() => "")
        ]);

        // If Armstrong, replace Wikipedia info with the Armstrong breakdown
        let funFact = numbersApiResponse;
        if (isArmstrong) {
            const armstrongCalculation = getArmstrongCalculation(n);
            funFact += ` It is an Armstrong number because: ${armstrongCalculation}.`;
        } else {
            funFact += wikipediaResponse ? ` ${wikipediaResponse}` : "";
        }

        externalCache.set(cacheKey, funFact);
        return funFact;
    } catch {
        return "No fun fact available.";
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

    // Pass "armstrong" if the number is Armstrong, or "null" if it is not
    const properties = classifyProperties(num, isArmstrong ? "armstrong" : null);

    // Fetch data in parallel
    try {
        const [funFact, parityInfo] = await Promise.all([
            fetchFunFact(num),
        ]);

        const responseData = {
            number: num,
            is_prime: isPrime,
            is_perfect: isPerfect,
            properties,
            digit_sum: `${digitSum} // sum of its digits`,
            fun_fact:`${funFact} // gotten from number api`,
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
    res.status(400).json({
        error: true,
        message: "Invalid request Check the endpoint and parameters.",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
