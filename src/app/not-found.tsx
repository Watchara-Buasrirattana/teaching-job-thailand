// src/app/not-found.tsx
import "@/app/globals.css"; // ✅ ต้อง Import CSS ตรงนี้ด้วย
import { Prompt } from "next/font/google"; // ✅ เรียกใช้ฟอนต์ตรงๆ

const prompt = Prompt({
    weight: ['300', '400', '700'],
    subsets: ["latin", "thai"],
    display: 'swap',
});

export default function RootNotFound() {
    return (
        <html lang="en">
            {/* ✅ ใส่ className ของฟอนต์ที่ body */}
            <body className={`${prompt.className} flex items-center justify-center min-h-screen bg-primary text-white`}>
                <div className="text-center px-4">
                    {/* เปลี่ยน text-primary เป็น text-accent เพื่อให้มองเห็นเลข 404 */}
                    <h1 className="text-9xl text-primary">404</h1>
                    <p className="text-2xl md:text-4xl mt-4">
                        Sorry, the page you are looking for does not exist.
                    </p>
                    <a
                        href="/"
                        className="mt-8 inline-block bg-primary text-white font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
                    >
                        Back to Home
                    </a>
                </div>
            </body>
        </html>
    );
}