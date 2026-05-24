import { query } from '../config/database.js';

export async function insertLab({ userId, labType, namespace, deploymentName, serviceName, accessUrl, status }) {
  const result = await query(
    `
      INSERT INTO labs (
        user_id,
        lab_type,
        namespace,
        deployment_name,
        service_name,
        access_url,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, user_id, lab_type, namespace, deployment_name, service_name, access_url, status, created_at
    `,
    [userId, labType, namespace, deploymentName, serviceName, accessUrl, status]
  );

  return result.rows[0];
}

export async function listLabsByUser(userId) {
  const result = await query(
    `
      SELECT id, user_id, lab_type, namespace, deployment_name, service_name, access_url, status, created_at
      FROM labs
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

export async function countLabsInNamespace(userId, namespace, excludedLabId = null) {
  const result = await query(
    `
      SELECT COUNT(*)::int AS count
      FROM labs
      WHERE user_id = $1
        AND namespace = $2
        AND ($3::uuid IS NULL OR id <> $3::uuid)
    `,
    [userId, namespace, excludedLabId]
  );

  return result.rows[0]?.count ?? 0;
}

export async function findLabByIdAndUser(id, userId) {
  const result = await query(
    `
      SELECT id, user_id, lab_type, namespace, deployment_name, service_name, access_url, status, created_at
      FROM labs
      WHERE id = $1 AND user_id = $2
      LIMIT 1
    `,
    [id, userId]
  );

  return result.rows[0] ?? null;
}

export async function deleteLabByIdAndUser(id, userId) {
  await query('DELETE FROM labs WHERE id = $1 AND user_id = $2', [id, userId]);
}