import { connect } from '@planetscale/database';
import { PrismaClient } from '@prisma/client/edge';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  const connection = connect({ url: connectionString });
  const adapter = new PrismaPlanetScale(connection);
  const prisma = new PrismaClient({ adapter });
  return prisma;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
