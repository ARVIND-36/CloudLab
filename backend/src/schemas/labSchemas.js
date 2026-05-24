import { z } from 'zod';

export const createLabSchema = z.object({
  labType: z.enum(['docker', 'terraform']),
});