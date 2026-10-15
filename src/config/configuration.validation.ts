import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
    PORT: z.coerce.number().default(3000),
    MONGO_DB: z.coerce.string()
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
    const result = envSchema.safeParse(config);

    if (!result.success) {
        throw new Error(`Config validation error: ${result.error.message}`)
    }

    return result.data;
}