/* ======================================================================
README.md - How to Run This NestJS Project
======================================================================

This NestJS project demonstrates three key API optimization techniques:
It demonstrates:
1.  **Caching:** Using @nestjs/cache-manager for in-memory caching.
2.  **Pagination:** Offset-based pagination suitable for traditional pagers or infinite scrolling.
3.  **Rate Limiting:** Global rate limiting using @nestjs/throttler.

---
### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- MongoDB instance running (e.g., on localhost:27017)

---
### Step 1: Project Setup

1.  Create a new directory for your project and navigate into it.
2.  Save all the files from this repository. 
3.  Install the dependencies:
    ```bash
    npm install
    ```
---
### Step 2: Seed the Database

1.  To properly test pagination, you need a good amount of data. This project includes a seeding service.
2.  Start your application in development mode:
    ```bash
    npm run start:dev
    ```
3.  In a new terminal, send a POST request to the seeding endpoint. This will create 200 dummy products in your database. You only need to do this once.
    curl -X POST http://localhost:3000/products/seed

---
### Step 3: Test the API Endpoints
Use curl or an API client like Postman to test the features.

#### A. Test Pagination (Infinite Scroll)
Request different pages of products.
# Get page 1, 10 items per page
curl "http://localhost:3000/products/paginated?page=1&limit=10"

# Get page 5, 5 items per page
curl "http://localhost:3000/products/paginated?page=5&limit=5"
The response will include data, total, page, and totalPages.


#### B. Test Caching
  1. First, get the ID of any product from the pagination response above.

  2. Request the product by its ID. The first time, the console will log "Fetching from DB...".

  curl http://localhost:3000/products/YOUR_PRODUCT_ID

  3. Immediately request the same product again. This time, you will get an instant response, and there will be no log in the console, indicating the response was served from the cache.

### C. Test Rate Limiting
The API is configured to allow only 5 requests every 10 seconds.

Run this command in your terminal. It sends 6 requests in quick succession.

for i in {1..6}; do curl -I "http://localhost:3000/products/paginated?page=1&limit=2"; done

Observe the output: The first 5 requests will receive a HTTP/1.1 200 OK status. The 6th request will receive a HTTP/1.1 429 Too Many Requests status, demonstrating that the rate limiter is working.
