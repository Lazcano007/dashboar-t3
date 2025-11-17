import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export function createContext() {
    return { db};
}

export type Context = ReturnType<typeof createContext>;