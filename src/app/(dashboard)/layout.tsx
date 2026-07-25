import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";

import { DashboardSidebar } from "./_components/dashboard-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Navbar />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8"
      >
        <DashboardSidebar role={session.user.role} name={session.user.name ?? "Utilisateur"} />
        <div className="min-w-0 flex-1">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
