import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'stdout' },
            { level: 'warn', emit: 'stdout' },
          ]
        : [{ level: 'error', emit: 'stdout' }],

    errorFormat: 'pretty',
  });
};

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/*
|--------------------------------------------------------------------------
| Query Performance Debugging
|--------------------------------------------------------------------------
|
| Helps identify slow or repeated queries during development.
| Extremely useful while optimizing dashboards and analytics.
|
*/

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (event) => {
    const duration = `${event.duration}ms`;

    if (event.duration > 300) {
      console.warn('🐢 Slow Query Detected');
      console.warn(`Duration: ${duration}`);
      console.warn(`Query: ${event.query}`);
      console.warn(`Params: ${event.params}`);
    }
  });
}