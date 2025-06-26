import { PrismaClient } from "@/generated/prisma";

const prismaClientSingleton = () => {
	return new PrismaClient();
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export default prisma;

if ("production" != process.env.NODE_ENV) {
	globalThis.prismaGlobal = prisma;
}
