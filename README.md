# Ashveil

## Run locally

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
```

The development server listens on port 3000.

## Deploy to Vercel

Set the Vercel project's Root Directory to this app's directory. The project is
configured to install from `package-lock.json`, run `npm run build`, and emit
Nitro's Vercel Build Output API bundle.

No database or environment variables are required to deploy the storefront.
Vercel builds the app and skips migrations when neither `DATABASE_URL` nor
`STORAGE_POSTGRES_URL` is set.
The shop uses its built-in catalog, and checkout sends the visitor's bag and
contact details to Ashveil on WhatsApp. Availability, delivery, and payment
are confirmed in chat; the site does not collect payment or store orders.

The admin dashboard can be viewed without a database, but product edits, stock
changes, and ledger entries need a PostgreSQL connection to persist. Add either
`DATABASE_URL` or `STORAGE_POSTGRES_URL` to the Vercel project's Environment
Variables; `DATABASE_URL` takes precedence if both are set.
Studio sign-in is disabled until `ASHVEIL_ADMIN_PASSWORD` and a randomly
generated `ASHVEIL_ADMIN_SESSION_SECRET` (at least 32 characters) are set in
Vercel's Environment Variables. Optionally set `ASHVEIL_ADMIN_EMAIL`; it
defaults to the store contact email. Never commit these values to the repository.
