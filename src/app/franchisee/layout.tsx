"use client";
import FranchiseeSidebar from "@/components/layout/Sidebar/FranchiseeSidebar";
import { usePathname } from "next/navigation";

export default function FranchiseeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/franchisee";

  if (isLoginPage) {
    return children;
  }

  return (
    <div className="min-h-screen flex">
      <FranchiseeSidebar />
      <main className="flex-1 bg-slate-50 overflow-x-hidden max-w-[100vw] px-8 sm:px-4 md:px-10 py-16 md:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
