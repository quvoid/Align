import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

// Always cache on the global — including in production.
//
// The usual `NODE_ENV !== 'production'` guard exists to stop dev hot-reload from
// leaking clients. On serverless it is actively harmful: a warm Vercel instance
// evaluates several separately-bundled entrypoints (route handlers, server
// actions) and without the global each one opens its own pool, multiplying
// connections against Supabase's pooler.
globalForPrisma.prisma = prisma

export * from '@prisma/client'
export default prisma
