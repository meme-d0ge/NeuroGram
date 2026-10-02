import { defineRelations } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

export const relations = defineRelations(schema);
export type Database = NodePgDatabase<typeof relations>;
