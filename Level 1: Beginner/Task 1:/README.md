# Task 1: HTML Structure and Basic Server

This project demonstrates:

- A structured HTML form for user input
- A simple Node.js server using Express
- Server-side form submission handling
- Server-side rendering using EJS

## Project Structure

```text
Task 1:
|-- package.json
|-- server.js
|-- public/
|   `-- styles.css
`-- views/
    |-- index.ejs
    `-- submission.ejs
```

## Run the Project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Run the automated route checks:

   ```bash
   npm test
   ```

4. Open your browser:

   [http://localhost:3000](http://localhost:3000)

## Features

- `GET /` renders the main form page
- `POST /submit` handles form submission
- Submitted form data is shown on a new EJS-rendered page
- Basic validation keeps the demo professional for internship review
- `npm test` checks the form page, successful submission flow, and validation flow
