import prisma from '@/lib/prisma';

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
        await prisma.activityLog.create({
            data: {
                adminId,
                action,
                entity,
                entityId,
                details
            }
        });
    } catch (error) {
        console.error("🔥 บันทึก Log ไม่สำเร็จ:", error);
    }
}