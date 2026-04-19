# Task 2: Inline Styles, Basic Interaction, and Server-Side Validation

This project expands the original internship form into a richer Express and EJS
application with:

- A more complex HTML form with multiple input types
- Inline styles that react to validation state
- Inline JavaScript for client-side validation and live UI feedback
- Server-side validation for every submitted field
- Temporary in-memory storage for validated submissions only

## Project Structure

```text
Task 2:
|-- package.json
|-- server.js
|-- public/
|   `-- styles.css
|-- tests/
|   `-- app.test.js
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

3. Run the automated checks:

   ```bash
   npm test
   ```

4. Open your browser:

   [http://localhost:3000](http://localhost:3000)

## Features

- `GET /` renders the advanced internship registration form
- `POST /submit` validates all fields on the server before saving
- Inline JavaScript checks common mistakes before the form is submitted
- Validated submissions are stored in temporary server-side memory
- Recent stored submissions are shown on the page for demo visibility
- `npm test` verifies the render flow, happy path submission, and rejection flow
