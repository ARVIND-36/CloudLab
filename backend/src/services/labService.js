import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import {
  buildLabResourceNames,
  buildLabels,
  createDeployment,
  createService,
  deleteDeployment,
  deleteService,
  deleteNamespace,
  ensureNamespace,
  waitForDeploymentReady,
  resolveServiceUrl,
} from './kubernetesService.js';
import {
  countLabsInNamespace,
  deleteLabByIdAndUser,
  findLabByIdAndUser,
  insertLab,
  listLabsByUser,
} from '../models/labModel.js';

function resolveImage(labType) {
  if (labType === 'docker') {
    return env.dockerLabImage;
  }

  if (labType === 'terraform') {
    return env.terraformLabImage;
  }

  throw new ApiError(400, 'Unsupported lab type');
}

export async function createLab(user, labType) {
  const namespace = `user-${user.id}`;
  const image = resolveImage(labType);
  const resourceNames = buildLabResourceNames(labType);
  const labels = buildLabels({
    userId: user.id,
    labType,
    deploymentName: resourceNames.deploymentName,
  });

  try {
    await ensureNamespace(namespace);
    await createDeployment({
      namespace,
      deploymentName: resourceNames.deploymentName,
      image,
      labels,
    });
    await createService({
      namespace,
      serviceName: resourceNames.serviceName,
      labels,
    });

    await waitForDeploymentReady(namespace, resourceNames.deploymentName);

    const accessUrl = await resolveServiceUrl(namespace, resourceNames.serviceName);

    return await insertLab({
      userId: user.id,
      labType,
      namespace,
      deploymentName: resourceNames.deploymentName,
      serviceName: resourceNames.serviceName,
      accessUrl,
      status: 'running',
    });
  } catch (error) {
  console.error('LAB CREATION ERROR:', error);

  await deleteService(namespace, resourceNames.serviceName).catch(() => undefined);
  await deleteDeployment(namespace, resourceNames.deploymentName).catch(() => undefined);
  await deleteNamespace(namespace).catch(() => undefined);

  throw error instanceof ApiError
    ? error
    : new ApiError(500, 'Failed to create lab environment');
}
}

export async function getLabs(userId) {
  return listLabsByUser(userId);
}

export async function removeLab(userId, labId) {
  const lab = await findLabByIdAndUser(labId, userId);

  if (!lab) {
    throw new ApiError(404, 'Lab not found');
  }

  const remainingLabs = await countLabsInNamespace(userId, lab.namespace, lab.id);

  await deleteService(lab.namespace, lab.service_name);
  await deleteDeployment(lab.namespace, lab.deployment_name);

  if (remainingLabs === 0) {
    await deleteNamespace(lab.namespace);
  }

  await deleteLabByIdAndUser(lab.id, userId);

  return lab;
}