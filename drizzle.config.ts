import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// โหลดค่าจากไฟล์ .env เพื่อดึง DATABASE_URL มาใช้
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in .env file");
}

export default defineConfig({
    schema: './src/db/schema.ts', // 👈 ชี้ไปที่ไฟล์ Schema ที่เราสร้างไว้
    out: './drizzle',             // 👈 โฟลเดอร์สำหรับเก็บประวัติ Migration
    dialect: 'mysql',             // 👈 ระบุฐานข้อมูลเป็น MySQL
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
});