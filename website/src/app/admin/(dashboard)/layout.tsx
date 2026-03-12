import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SessionProvider } from "@/components/admin/SessionProvider";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
