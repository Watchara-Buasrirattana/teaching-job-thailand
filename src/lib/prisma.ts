// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const prismaClientSingleton = () => {
    // 1. แกะ URL ของ z.com ออกมาเป็นส่วนๆ
    const dbUrl = new URL(process.env.DATABASE_URL!);

    // 2. สร้าง Adapter สำหรับเชื่อมต่อ
    const adapter = new PrismaMariaDb({
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port || '3306', 10),
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1), // ตัดเครื่องหมาย / ข้างหน้าออก
    });

    // 3. ยัด Adapter ใส่เข้าไปใน PrismaClient
    return new PrismaClient({ adapter });
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma