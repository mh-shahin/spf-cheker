SPF Record Checker
A modern, responsive web application to check SPF (Sender Policy Framework) records for any domain. Built with Next.js, React, and Tailwind CSS.
Features

DNS Lookup: Real-time SPF record lookup for any domain
Detailed Results: View raw SPF records and parsed mechanisms
Expandable Includes: Click to expand include: and redirect= directives
Loading States: Visual feedback during DNS queries
Modern UI: Clean, responsive design with Tailwind CSS
Error Handling: Graceful handling of invalid domains and DNS errors

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (version 18.0 or higher)
npm or yarn package manager

Installation
1. Clone the repository
bashgit clone (https://github.com/mh-shahin/spf-cheker.git)
cd spf-checker

2. Install dependencies
npm install
npm install dns2

3. Run the development server
npm run dev

4. Open your browser
Navigate to http://localhost:3000
Usage

Project live link: https://spf-cheker.vercel.app/

Enter a domain name in the input field (e.g., google.com, github.com)
Click the "Check SPF" button
View the SPF record results:

Raw SPF record text
Parsed mechanisms
Expandable include: and redirect= directives

How It Works

DNS Lookup Process
1. User Input: User enters a domain name
2. API Request: Frontend sends POST request to /api/check-spf
3. DNS Query: Server performs DNS TXT record lookup using Node.js dns module
4. Filtering: Filter records that start with v=spf1
5. Parsing: Parse SPF mechanisms (include:, redirect=, ip4:, etc.)
6. Response: Return structured data to frontend
7. Display: Render results with expandable sections

API Endpoint
Endpoint: POST /api/check-spf

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
