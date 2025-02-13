import { ObjectId } from 'src/common/types';
import { z } from 'zod';

export const IdSignalDtoSchema = z.object({
  id: z.string().refine(ObjectId.is),
});
