# Number Classification API

This API analyzes a number and returns its mathematical properties, a fun fact, and parity information. It is built using Node.js and Express and integrates with external APIs like Numbers API and Wikipedia.

## Features

- **Mathematical Properties**: Checks if a number is prime, perfect, or an Armstrong number.
- **Digit Sum**: Calculates the sum of the digits of the number.
- **Fun Fact**: Fetches a fun fact about the number from the Numbers API.
- **Parity Information**: Retrieves parity (odd/even) information from Wikipedia.
- **Error Handling**: Returns a 400 Bad Request for invalid inputs.

## Analyze a Number

- **URL**: `/api-classify-number?n={number}`
- **Method**: GET
- **Response**: JSON with the analyzed data (number, properties, fun fact, and parity information).

### Example Response:

```json
{
  "number": 153,
  "is_prime": false,
  "is_perfect": false,
  "is_armstrong": true,
  "properties": ["armstrong", "odd", "positive"],
  "digit_sum": 9,
  "fun_fact": "153 is a narcissistic number.",
  "parity_info": "Parity refers to the property of an integer's divisibility by 2."
}

Error Response (Invalid Input):
{
  "error": "Invalid number provided"
}

Example of Invalid Input:
1. URL: /api-classify-number?n=alphabet
2. Method: GET

Installation
1. Prerequisites
1.1 Node.js (v16 or higher)
git clone https://github.com/Andred17/number-classification-api.git

cd number-classification-api
npm install
npm start

To deploy 
Vercel, render e.t.c can be used.