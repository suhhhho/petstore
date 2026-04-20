# Swagger Petstore API Test Report

## Candidate
- Name: <Sofja Portnova>
- Date: 2026-04-20
- Framework: Playwright Test (JavaScript)
- Base URL: https://petstore.swagger.io/v2

## Objective
Automate functional, negative, and edge-case API tests for Swagger Petstore, covering multiple endpoints and HTTP methods.

## Endpoints Covered
1. `GET /store/inventory`
2. `GET /pet/findByStatus?status=available`
3. `POST /pet`
4. `GET /pet/{petId}`
5. `PUT /pet`
6. `DELETE /pet/{petId}`
7. `POST /user`
8. `GET /user/login?username={username}&password={password}`
9. `GET /user/{username}`
10. `DELETE /user/{username}`

## Implemented Scenarios
1. Functional: inventory retrieval returns JSON object.
2. Functional: query parameter filtering by pet status.
3. Functional lifecycle: create pet, fetch pet, update pet, delete pet.
4. Negative: invalid path parameter for pet lookup.
5. Edge: very large petId lookup.
6. Functional lifecycle: create user, login via query params, get user by path param, delete user.

## Observations / Issues
- Swagger Petstore is a public shared environment; data can be changed by other users.
- Eventual consistency can appear right after `POST` operations; the tests include a short retry for pet retrieval.
- Some negative responses may vary slightly by status code depending on backend behavior (e.g., 400/404/405), and assertions are written to tolerate valid variants.

## How to Run
```bash
npm install
npm test
```

Optional HTML report:
```bash
npm run test:report
```
