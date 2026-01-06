# Cariex – Dental Caries Detection Platform

Cariex is a full‑stack web platform for automated dental caries (cavity) detection and clinical decision support. 
It combines a Django REST API, a TensorFlow segmentation/classification model, and a modern Next.js (React + TypeScript) frontend.

---

## Repository Structure

```text
Cariex-BE/   # Django REST API, AI model and data layer
Cariex-FE/   # Next.js frontend (App Router) for clinicians
```

### Backend (Cariex-BE)

Main apps (Django project `backend`):

- `authentication` – custom user model, JWT auth (login, registration, password reset).
- `accounts` – account/profile management.
- `dashboard` – patients, statistics and high‑level overview.
- `AIModel` – model loading, image preprocessing, diagnosis, and explainability (XAI) endpoints.
- `dentist_feedback` – capture clinician feedback on model outputs.

Key endpoints are exposed under `/api/*` (see `backend/urls.py`):

- `/api/auth/…` – authentication and user management.
- `/api/dashboard/…` – dashboard and patient‑related data.
- `/api/accounts/…` – account/profile endpoints.
- `/api/ai/…` – AI pipeline:
  - `upload/` – upload dental image for analysis.
  - `preprocess/<id>/`, `detect/<id>/`, `classify/<id>/` – internal pipeline stages.
  - `diagnosis/all/`, `diagnosis/<id>/`, `diagnosis/<id>/delete/` – diagnosis management.
- `/api/feedback/…` – dentist feedback endpoints.

The AI model is loaded from `AIModel/ml_models/adult_teeth.h5` using TensorFlow, with utilities for
preprocessing, severity classification and bounding‑box generation.

### Frontend (Cariex-FE)

Next.js 16 (App Router) + React 19 + TypeScript with:

- UI: Tailwind CSS v4, Radix UI, Lucide icons, Recharts, Framer Motion.
- Data: Supabase client, REST calls to the Django API.
- State & utilities: custom hooks and service modules in `services/` and `hooks/`.

Important areas:

- `app/` – routing and pages (authentication, dashboard, upload, analysis, patients, profile).
- `services/` – typed API clients (auth, dashboard, patients, scans, XAI, etc.).
- `lib/supabase.ts` – Supabase browser client.
- `types/` – shared TypeScript types.

The frontend talks to the backend via `NEXT_PUBLIC_API_URL` and to Supabase via
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## Tech Stack

**Backend**
- Python 3.x
- Django 5
- Django REST Framework
- `djangorestframework-simplejwt` for JWT auth
- PostgreSQL (primary database)
- TensorFlow 2, OpenCV, NumPy for image analysis
- `python-decouple` for environment configuration
- Supabase Python client for storage/integration

**Frontend**
- Next.js 16 (App Router)
- React 19, TypeScript 5
- Tailwind CSS 4, Radix UI, Lucide, Recharts, Framer Motion
- `@supabase/supabase-js` for Supabase access

---

## Prerequisites

- **Node.js** >= 18 (recommended: latest LTS)
- **npm** (or yarn/pnpm, examples use npm)
- **Python** >= 3.10
- **PostgreSQL** (local instance or managed service)
- **Supabase project** (optional but required for Supabase‑backed features)

All commands below are written for Windows PowerShell, but work similarly on other platforms.

---

## Backend Setup (Cariex-BE)

1. **Create and activate a virtual environment**

   ```bash
   cd Cariex-BE
   python -m venv .venv
   .venv\Scripts\activate
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**

   The Django settings use `python-decouple` to read configuration such as the secret key,
   database, email and Supabase credentials.

   Create a `.env` file in `Cariex-BE/` (or configure equivalent environment variables) with e.g.:

   ```ini
   # Django
   SECRET_KEY=your-django-secret-key

   # Database (PostgreSQL)
   DB_NAME=cariex
   DB_USER=cariex_user
   DB_PASSWORD=your-db-password
   DB_HOST=localhost
   DB_PORT=5432

   # Email (for password reset and notifications)
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@example.com
   EMAIL_HOST_PASSWORD=your-email-app-password
   DEFAULT_FROM_EMAIL="Cariex <no-reply@your-domain.com>"

   # Supabase (backend access key)
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-service-role-or-secret-key
   ```

4. **Apply migrations and create a superuser**

   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Run the development server**

   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

   The API will be available at `http://localhost:8000/api/…`.

> Note: Media uploads (dental images, etc.) are stored under `Cariex-BE/media/` and served via
> `MEDIA_URL` when `DEBUG=True`.

---

## Frontend Setup (Cariex-FE)

1. **Install dependencies**

   ```bash
   cd Cariex-FE
   npm install
   ```

2. **Configure environment variables**

   Create a `.env.local` file in `Cariex-FE/`:

   ```ini
   # Base URL for the Django API (note the /api suffix)
   NEXT_PUBLIC_API_URL=http://localhost:8000/api

   # Supabase (browser client)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
   ```

3. **Run the frontend**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

---

## Authentication & Security

- Uses a custom `User` model (`AUTH_USER_MODEL = "authentication.User"`).
- JWT authentication via `rest_framework_simplejwt`:
  - Access and refresh tokens are issued by the `/api/auth/login/` endpoint.
  - Frontend stores tokens in `localStorage` and sends them via `Authorization: Bearer <token>`.
- Default REST Framework permission is `IsAuthenticated`, so most API endpoints require a valid JWT.

Make sure you:

- Use a strong, unique `SECRET_KEY` in production.
- Set `DEBUG=False` and configure `ALLOWED_HOSTS` appropriately.
- Use secure database and Supabase credentials (never commit `.env` files).

---

## AI Pipeline Overview

1. **Image upload** – the frontend sends an image (and patient id) to `/api/ai/upload/`.
2. **Preprocessing** – images are normalized and resized to the model input size.
3. **Inference** – TensorFlow model in `AIModel/ml_models/adult_teeth.h5` predicts caries presence and severity.
4. **Postprocessing** – severity classification, affected area estimation and bounding‑box generation.
5. **Explainability** – additional XAI utilities generate visual overlays to help clinicians interpret results.
6. **Storage** – images and related artifacts can be stored locally (media folder) and/or in Supabase.

Diagnoses can then be listed, inspected and deleted through the `/api/ai/diagnosis/*` endpoints and
consumed by the frontend (e.g. analysis and dashboard screens).

---

## Running Tests

**Backend**

```bash
cd Cariex-BE
.venv\Scripts\activate  # if not already active
python manage.py test
```

**Frontend**

Currently there are no dedicated unit tests configured; you can run the linter with:

```bash
cd Cariex-FE
npm run lint
```

---

## Deployment Notes

- Configure all environment variables for both backend and frontend in your deployment environment.
- Set `DEBUG=False` and update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` in `backend/settings.py`.
- Use a production‑grade PostgreSQL instance and secure Supabase keys.
- For the frontend, build and serve a static production bundle:

  ```bash
  cd Cariex-FE
  npm run build
  npm start
  ```

If you’d like, I can also add shorter service‑specific READMEs inside `Cariex-BE/` and `Cariex-FE/` with only the commands and environment variables relevant to each side.
