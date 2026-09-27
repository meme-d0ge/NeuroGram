import { z } from "zod";

export const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(3000),

    REDIS_HOST: z.string().min(1).default("127.0.0.1"),
    REDIS_PORT: z.coerce.number().int().positive().default(6379),
    REDIS_USERNAME: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.coerce.number().int().min(0).default(0),
    REDIS_TLS: z.stringbool().default(false),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
    const parsed = envSchema.safeParse(source);
    if (!parsed.success) {
        throw new Error(
            `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
        );
    }
    return parsed.data;
}
