import { PrismaClient } from "@/generated/prisma";

const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export default prisma;

if ("production" != process.env.NODE_ENV) {
	globalThis.prismaGlobal = prisma;
}
