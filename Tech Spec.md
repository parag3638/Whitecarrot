# Whitecarrot Tech Spec

## Assumptions
- The UI is a Next.js app using the App Router and Tailwind CSS.
- Backend is an Express API server connected to Supabase.
- Supabase handles recruiter authentication (email/password).


## Architecture
- **Frontend**: Next.js (App Router) + React + TypeScript
- **Backend**: Express API server
- **UI**: Tailwind + shadcn/ui components
- **API**:
  - Public: `/api/public` for careers pages
  - Recruiter: `/api/recruiter` for admin/editor
- **Routing (UI)**:
  - `/login` recruiter login
  - `/dashboard` recruiter admin panel
  - `/careers/[companySlug]` public portal

### Backend notes
- `Backend/index.js` wires CORS, JSON middleware, Supabase client, and routes.
- CORS allowlist includes `http://localhost:3000` and `https://whitecarrot-two.vercel.app`.


## API summary (backend)
### Public
- `GET /api/public/company/:slug` → published company by slug
- `GET /api/public/company/:slug/jobs` → published jobs with optional filters

### Recruiter (auth required)
- `GET /api/recruiter/company/:slug` → recruiter-accessible company
- `PUT /api/recruiter/company/:slug` → update theme/sections/culture video
- `POST /api/recruiter/company/:slug/publish` → publish company
- `POST /api/recruiter/company/:slug/unpublish` → unpublish company

## Test Plan
### Manual smoke tests
1. **Login**: valid credentials redirect to `/dashboard`, cookies set.
2. **Dashboard load**: company data renders; loader shown while fetching.
3. **Update company**: save changes to theme/sections; success toast appears.
4. **Publish/Unpublish**: status updates without errors.
5. **Section CRUD**: add/edit/reorder/delete sections.
6. **Careers portal**: open `/careers/[companySlug]`, verify layout, sections, jobs.
7. **API health**: GET `/health` responds with `{ ok: true }`.
8. **Public API**: verify public endpoints return published-only data.
9. **Recruiter API**: verify auth required and recruiter ownership enforced.

### Edge cases
- Missing or invalid company slug shows error state.
- Expired token shows access denied state.
- Empty sections list renders “No sections yet”.
