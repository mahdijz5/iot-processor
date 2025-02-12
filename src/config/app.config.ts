import { z } from 'zod';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const configSchema = z.object({
  app: z.object({
    port: z.preprocess((val) => Number(val), z.number().positive()),
    docPath: z.string(),
  }),
  
  database: z.object({
    uri: z.string(),
  }),

  rmq : z.object({
    url : z.string()
  })
  
});

export const config = configSchema.parse({
  app: {
    port: process.env.PORT,
    docPath: process.env.DOC_PATH,
  },
  database : {
    uri : process.env.DB_URI
  },
  rmq : {
    url : process.env.RABBITMQ_URL
  }
});
