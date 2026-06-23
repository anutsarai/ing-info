import { neon, neonConfig } from "@neondatabase/serverless";

neonConfig.webSocketConstructor = undefined;

export const sql = neon(process.env.DATABASE_URL!);