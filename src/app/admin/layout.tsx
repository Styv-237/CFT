import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";

import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Navbar />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8"
      >
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
