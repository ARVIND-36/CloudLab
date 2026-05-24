import dotenv from 'dotenv';

dotenv.config();

function toNumber(value, fallback) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toNumber(process.env.PORT, 4000),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/cloudlab',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me-in-production-change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  dockerLabImage: process.env.DOCKER_LAB_IMAGE ?? 'ghcr.io/cloudlab/docker-lab:latest',
  terraformLabImage: process.env.TERRAFORM_LAB_IMAGE ?? 'ghcr.io/cloudlab/terraform-lab:latest',
  labContainerPort: toNumber(process.env.LAB_CONTAINER_PORT, 80),
  labServiceType: process.env.LAB_SERVICE_TYPE ?? 'LoadBalancer',
  labBaseUrl: process.env.LAB_BASE_URL ?? '',
  labUrlTimeoutMs: toNumber(process.env.LAB_URL_TIMEOUT_MS, 60000),
  labUrlPollIntervalMs: toNumber(process.env.LAB_URL_POLL_INTERVAL_MS, 2000),
};