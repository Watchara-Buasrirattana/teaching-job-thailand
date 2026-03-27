import "@/app/globals.css";
import AdminLayoutWrapper from "./AdminLayoutWrapper";

export const metadata = {
    title: "Admin Dashboard",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AdminLayoutWrapper>
                    {children}
                </AdminLayoutWrapper>
            </body>
        </html>
    );
}