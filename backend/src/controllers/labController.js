import { asyncHandler } from '../utils/asyncHandler.js';
import { createLab, getLabs, removeLab } from '../services/labService.js';

export const create = asyncHandler(async (req, res) => {
  const lab = await createLab(req.user, req.body.labType);

  res.status(201).json({
    status: 'created',
    namespace: lab.namespace,
    labUrl: lab.access_url,
    lab,
  });
});

export const list = asyncHandler(async (req, res) => {
  const labs = await getLabs(req.user.id);

  res.json({
    status: 'ok',
    labs,
  });
});

export const remove = asyncHandler(async (req, res) => {
  await removeLab(req.user.id, req.params.id);

  res.json({
    status: 'deleted',
  });
});