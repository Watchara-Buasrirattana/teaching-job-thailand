// src/lib/logger.ts
import { db } from '@/lib/db';
import { activityLog } from '@/db/schema';

export async function logAdminAction({
    adminId,
    action,
    entity,
    entityId,
    details
}: {
    adminId: number; 
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: string;
    entityId: string;
    details?: string;
}) {
    try {
        // บันทึก Log ลงในฐานข้อมูล
        await db.insert(activityLog).values({
            adminId,
            action,
            entity,
            entityId,
            details
        });
    } catch (error) {
        console.error("🔥 บันทึก Log ไม่สำเร็จ:", error);
    }
}