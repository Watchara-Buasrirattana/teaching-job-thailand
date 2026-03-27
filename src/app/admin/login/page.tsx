'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react'; // ใช้ icon ฟันเฟืองจาก lucide-react

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (data.success) {
                // ถ้าสำเร็จ ให้ไปหน้า Dashboard (ที่เราจะทำต่อ)
                router.push('/admin/dashboard');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#E5E7EB] flex items-center justify-center font-prompt p-4">
            <div className="bg-white p-10 rounded-xl shadow-sm w-full max-w-md">
                {/* Icon ฟันเฟืองสีเหลือง */}
                <div className="flex justify-center mb-6">
                    <div className="text-[#FBBF24]">
                        <Settings size={80} strokeWidth={1.5} />
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00008B] text-white py-3 rounded-full text-lg font-bold hover:bg-blue-900 transition-all active:scale-95 disabled:bg-gray-400 mt-4"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </main>
    );
}