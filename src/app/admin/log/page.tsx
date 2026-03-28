import prisma from "@/lib/prisma";

export default async function ActivityLogPage() {
    // ดึงข้อมูล Log พร้อมเชื่อมกับตาราง Admin เพื่อเอาชื่อมาแสดง
    const logs = await prisma.activityLog.findMany({
        include: {
            admin: true, // ดึงข้อมูล Admin มาด้วย
        },
        orderBy: {
            createdAt: 'desc', // เอาล่าสุดขึ้นก่อน
        },
    });

    return (

        <div className="p-6 font-prompt">
            <h1 className="text-2xl font-bold text-primary mb-6">Activity Logs</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b text-gray-500">
                        <tr>
                            <th className="p-4">Admin Name</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {logs.map((log) => (
                            <tr key={log.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 font-bold">{log.admin?.name || log.admin?.username}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                        log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{log.details}</td>
                                <td className="p-4 text-gray-400">
                                    {new Date(log.createdAt).toLocaleString('th-TH')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}