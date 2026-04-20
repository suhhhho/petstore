# Petstore API Tests (Playwright)

Automated API tests for the Swagger Petstore service as a QA take-home style assignment.

## Stack
- Node.js
- Playwright Test (`@playwright/test`)

## Coverage
- Functional, negative, and edge-case tests
- HTTP methods: GET, POST, PUT, DELETE
- Path and query parameter validation
- 5+ endpoints covered

## Setup
1. Install Node.js (LTS recommended)
2. Install dependencies:
   ```bash
   npm install
   ```

## Run Tests
```bash
npm test
```

## HTML Report
```bash
npm run test:report
```

## Files
- `tests/petstore.api.spec.js`: test scenarios
- `playwright.config.js`: test configuration
- `REPORT.md`: brief assignment report template
