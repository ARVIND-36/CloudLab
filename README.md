# CloudLab

CloudLab is a production-style MVP for student cloud labs.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Auth: JWT
- Kubernetes: `@kubernetes/client-node`
- Deployment: AKS, Docker, GitHub Actions

## Local Development

1. Copy `.env.example` to `.env`.
2. Start the stack:

```bash
docker compose up --build
```

3. Open the frontend at `http://localhost:5173`.

## Backend API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/labs`
- `POST /api/labs/create`
- `DELETE /api/labs/:id`

## Kubernetes

The `k8s/` directory contains AKS deployment manifests for the frontend and backend. Use a managed PostgreSQL instance or update the backend secret to point at your database.

## Notes

- The lab creation flow provisions a namespace per user and stores the lab record in PostgreSQL.
- The access URL is resolved from the Kubernetes Service load balancer when available.