# Mana Driver — Driver Hiring & Management Platform

A two-sided marketplace connecting **Drivers** (seeking driving jobs) with **Customers** (hiring drivers). Customers post jobs (hourly, temporary, or permanent). Drivers browse, filter, and apply. Customers review applicants and hire.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS + ShadCN UI |
| Backend | Node.js + Express.js + TypeScript |
| Database | MongoDB Atlas + Mongoose |
| File Storage | Cloudinary |
| Auth | JWT (access + refresh tokens) + bcrypt |

## Project Structure

```
site/
├── frontend/          # React 18 + Vite + Tailwind + ShadCN
│   └── src/
│       ├── components/
│       │   ├── ui/        # ShadCN / design system components
│       │   ├── layout/    # Navbar, Footer, PageWrapper
│       │   └── shared/    # JobCard, ApplicantCard, etc.
│       ├── pages/
│       │   ├── public/    # Landing page
│       │   ├── auth/      # Login, Signup
│       │   ├── driver/    # Driver dashboard & flows
│       │   └── customer/  # Customer dashboard & flows
│       ├── hooks/
│       ├── context/
│       ├── services/      # Axios API client
│       ├── types/
│       ├── utils/
│       └── constants/
└── backend/           # Node.js + Express + TypeScript
    └── src/
        ├── routes/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── services/
        ├── utils/
        ├── types/
        └── config/
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Backend

```bash
cd site/backend
npm install
cp .env.example .env   # Fill in your env vars
npm run dev            # Starts nodemon + ts-node dev server
```

### Frontend

```bash
cd site/frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm run dev            # Vite dev server on :5173
```

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required variables.
