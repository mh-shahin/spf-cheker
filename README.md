## SPF Record Checker
A modern, responsive web application to check SPF (Sender Policy Framework) records for any domain. Built with Next.js, React, and Tailwind CSS.

## Features

- DNS Lookup: Real-time SPF record lookup for any domain
- Detailed Results: View raw SPF records and parsed mechanisms
- Expandable Includes: Click to expand include: and redirect= directives
- Loading States: Visual feedback during DNS queries
- Modern UI: Clean, responsive design with Tailwind CSS
- Error Handling: Graceful handling of invalid domains and DNS errors

## Prerequisites
Before you begin, ensure you have the following installed:

- Node.js (version 18.0 or higher)
- npm or yarn package manager

## Installation
1. Clone the repository
- git clone (https://github.com/mh-shahin/spf-cheker.git)
- cd spf-checker

2. Install dependencies
```bash
npm install
npm install dns2
```

3. Run the development server
```bash
npm run dev
```

4. Open your browser
- Navigate to http://localhost:3000

Project live link: https://spf-cheker.vercel.app/

- Enter a domain name in the input field (e.g., google.com, github.com)
- Click the "Check SPF" button
- View the SPF record results:

Raw SPF record text.
Parsed mechanisms.
Expandable include: and redirect= directives

## How It Works

DNS Lookup Process
1. User Input: User enters a domain name
2. API Request: Frontend sends POST request to /api/check-spf
3. DNS Query: Server performs DNS TXT record lookup using Node.js dns module
4. Filtering: Filter records that start with v=spf1
5. Parsing: Parse SPF mechanisms (include:, redirect=, ip4:, etc.)
6. Response: Return structured data to frontend
7. Display: Render results with expandable sections

## API Endpoint
Endpoint: POST /api/check-spf

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Limitations

- Browser Restriction: Cannot perform DNS lookups directly from browser - requires API route on server
- Recursion Depth: Expanded include: domains only go 1 level deep (not fully recursive)
- No Caching: Each lookup makes a fresh DNS query - no result caching implemented
- Rate Limiting: No rate limiting on API - could be abused in production
- DNS Timeout: Queries may timeout for slow-responding DNS servers (default Node.js timeout)
- No Validation: Displays SPF records but doesn't validate if they're correctly formatted or - within the 10 DNS lookup limit
- TXT Record Only: Only checks TXT records, doesn't verify actual email sending infrastructure
- Authentication Required Sites: Cannot access domains behind authentication or private networks