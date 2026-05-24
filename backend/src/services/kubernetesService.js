import crypto from 'crypto';
import k8s from '@kubernetes/client-node';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const kubeConfig = new k8s.KubeConfig();

if (process.env.KUBERNETES_SERVICE_HOST) {
  kubeConfig.loadFromCluster();
} else {
  kubeConfig.loadFromDefault();
}

const coreV1 = kubeConfig.makeApiClient(k8s.CoreV1Api);
const appsV1 = kubeConfig.makeApiClient(k8s.AppsV1Api);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildLabels({ userId, labType, deploymentName }) {
  return {
    app: 'cloudlab',
    userId,
    labType,
    deploymentName,
  };
}

async function namespaceExists(namespace) {
  try {
    await coreV1.readNamespace(namespace);
    return true;
  } catch (error) {
    if (error.response?.statusCode === 404) {
      return false;
    }

    throw error;
  }
}

export async function ensureNamespace(namespace) {
  const exists = await namespaceExists(namespace);

  if (exists) {
    return;
  }

  await coreV1.createNamespace({
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: {
      name: namespace,
    },
  });

  logger.info('Created namespace', { namespace });
}

export async function createDeployment({ namespace, deploymentName, image, labels }) {
  const manifest = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: deploymentName,
      labels,
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: labels,
      },
      template: {
        metadata: {
          labels,
        },
        spec: {
          containers: [
            {
              name: deploymentName,
              image,
              imagePullPolicy: 'Always',
              ports: [
                {
                  containerPort: env.labContainerPort,
                },
              ],
            },
          ],
        },
      },
    },
  };

  await appsV1.createNamespacedDeployment(namespace, manifest);

  logger.info('Created deployment', { namespace, deploymentName, image });
}

export async function createService({ namespace, serviceName, labels }) {
  await coreV1.createNamespacedService(namespace, {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: serviceName,
      labels,
    },
    spec: {
      type: env.labServiceType,
      selector: labels,
      ports: [
        {
          name: 'http',
          port: 80,
          targetPort: env.labContainerPort,
        },
      ],
    },
  });

  logger.info('Created service', { namespace, serviceName, type: env.labServiceType });
}

export async function deleteDeployment(namespace, deploymentName) {
  try {
    await appsV1.deleteNamespacedDeployment(deploymentName, namespace);
    logger.info('Deleted deployment', { namespace, deploymentName });
  } catch (error) {
    if (error.response?.statusCode !== 404) {
      throw error;
    }
  }
}

export async function waitForDeploymentReady(namespace, deploymentName) {
  const deadline = Date.now() + env.labUrlTimeoutMs;

  while (Date.now() < deadline) {
    const response = await appsV1.readNamespacedDeploymentStatus(deploymentName, namespace);
    const deployment = response.body;
    const status = deployment.status || {};

    const available = Number(status.availableReplicas || 0);
    const desired = Number(status.replicas || 1);

    if (available >= 1 && available <= desired) {
      return deployment;
    }

    const progressing = (status.conditions || []).find((c) => c.type === 'Progressing');
    if (progressing && progressing.status === 'False') {
      throw new Error(`Deployment ${deploymentName} failed to progress`);
    }

    await sleep(env.labUrlPollIntervalMs);
  }

  throw new Error(`Timed out waiting for deployment ${deploymentName} to become ready`);
}

export async function deleteService(namespace, serviceName) {
  try {
    await coreV1.deleteNamespacedService(serviceName, namespace);
    logger.info('Deleted service', { namespace, serviceName });
  } catch (error) {
    if (error.response?.statusCode !== 404) {
      throw error;
    }
  }
}

export async function resolveServiceUrl(namespace, serviceName) {
  return `http://${serviceName}.${namespace}.svc.cluster.local`;
}

export async function deleteNamespace(namespace) {
  try {
    await coreV1.deleteNamespace(namespace);
    logger.info('Deleted namespace', { namespace });
  } catch (error) {
    if (error.response?.statusCode !== 404) {
      throw error;
    }
  }
}

export function buildLabResourceNames(labType) {
  const suffix = crypto.randomUUID().slice(0, 8);
  const deploymentBase = `${labType}-lab`;

  return {
    deploymentName: `${deploymentBase}-${suffix}`,
    serviceName: `${deploymentBase}-svc-${suffix}`,
  };
}