# Whitecarrot

Full-stack project with a Next.js UI and an Express backend.

## Quick start
1) Install dependencies
   - `cd UI && npm install`
   - `cd ../Backend && npm install`
2) Configure env
   - UI: create `UI/.env.local`
   - Backend: create `Backend/.env`
3) Run dev servers
   - UI: `cd UI && npm run dev`
   - Backend: `cd Backend && npm start`
4) Open
   - UI: `http://localhost:3000`
   - API health: `http://localhost:9000/health`

## What’s included
- **UI**: Next.js (App Router), React, Tailwind, shadcn/ui
- **Backend**: Express API with Supabase integration

## Environment variables
### UI (`UI/.env.local`)
- `NEXT_PUBLIC_API_BASE_URL` - API base URL for recruiter/admin requests
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_COMPANY_SLUG` - default company slug used in the dashboard
- `NEXT_PUBLIC_COMPANY_SLUG_MAP` - optional JSON map for domain -> slug
  - Example: `{"example.com":"acme"}`

### Backend (`Backend/.env`)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `PORT` - API port (defaults to 9000)

## App routes
### UI
- `/login` - recruiter login
- `/dashboard` - recruiter admin panel
- `/careers/[companySlug]` - public company careers portal

### API
- `GET /health` - health check
- `GET /api/public/company/:slug` - published company by slug
- `GET /api/public/company/:slug/jobs` - published jobs by company
- `GET /api/recruiter/company/:slug` - recruiter company (auth)
- `PUT /api/recruiter/company/:slug` - update company (auth)
- `POST /api/recruiter/company/:slug/publish` - publish (auth)
- `POST /api/recruiter/company/:slug/unpublish` - unpublish (auth)

## Scripts
### UI
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

### Backend
- `npm start`

## Improvement plan
- Add tests (unit + e2e) for recruiter flows and public careers pages.
- Add CI pipeline for linting, build, and tests.
- Add API request logging and rate limiting.

## User guide (step-by-step)
1) Start backend (`cd Backend && npm start`).
2) Start UI (`cd UI && npm run dev`).
3) Go to `/login` and sign in as a recruiter.
4) In `/dashboard`, edit company branding and sections.
5) Publish the company to make it live.
6) Visit `/careers/[companySlug]` to view the public portal.

## Login help
Use these admin credentials on `/login` to access the recruiter dashboard:
- **Whitecarrot Admin** — Email: `admin@whitecarrot.com` | Password: `Whitecarrot@123` | Company: Whitecarrot | Role: admin
- **Helios Health Admin** — Email: `admin@helioshealth.com` | Password: `Helios@123` | Company: Helios Health | Role: admin
- **Atlas Commerce Admin** — Email: `admin@atlascommerce.com` | Password: `Atlas@123` | Company: Atlas Commerce | Role: admin
- **Nebula Systems Admin** — Email: `admin@nebulasystems.com` | Password: `Nebula@123` | Company: Nebula Systems | Role: admin
- **Northlane Labs Admin** — Email: `admin@northlanelabs.com` | Password: `Northlane@123` | Company: Northlane Labs | Role: admin


