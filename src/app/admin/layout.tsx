import "@/app/globals.css";
import AdminLayoutWrapper from "./AdminLayoutWrapper";

export const metadata = {
    title: "Admin Dashboard",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayoutWrapper>
            {children}
        </AdminLayoutWrapper>
    );
}