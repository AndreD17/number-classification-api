This API analyzes a number and returns its mathematical properties, a fun fact, and parity information. It is built using Node.js and Express, and it integrates with external APIs like Numbers API and Wikipedia.
Features

Mathematical Properties: Checks if a number is prime, perfect, or an Armstrong number.

** Digit Sum: Calculates the sum of the digits of the number.

** Fun Fact: Fetches a fun fact about the number from the Numbers API.

** Parity Information: Retrieves parity (odd/even) information from Wikipedia.

** Error Handling: Returns a 400 Bad Request for invalid inputs.

Analyze a Number
** URL: /analyze/:number

** Method: GET

** Response:

**Error Response (Invalid Input)
URL: /analyze/alphabet

Method: GET
** Installation
** Prerequisites
** Node.js (v16 or higher)
STEPS
1.git clone https://github.com/Andred17/number-classification-api.git
cd number-classification-api
2. Install dependencies
npm install
3. Start server 
npm start
 ** To deploy
 1. Install the Vercel CLI:
 npm install -g vercel
 2. vercel

 TECHNOLOGIES USED IN TASK 
 1. Express : Web framework for handling HTTP requests.
 2. Axios : HTTP client for making requests to external APIs.
 3. Node.js : JavaScript runtime for building the API.
 4. Cors  : Middleware to enable Cross-Origin Resource Sharing.
 5. Vercel : Platform for deploying the API.

 CONTRIBUTING 
 1. Fork repo
 2. create a new branch 
 git checkout -b feature/your-feature-name
 3. Commit changes 
 git commit -m "Add your feature"
 4. Push branch 
 git push origin feature/your-feature-name

 OPEN A PULL REQUEST