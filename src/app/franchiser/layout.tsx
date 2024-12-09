import FranchiserSidebar from "@/components/layout/Sidebar/FranchiserSidebar";

export default function FranchiserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <FranchiserSidebar />
      <main className="flex-1 bg-slate-50 overflow-x-hidden max-w-[100vw] px-8 sm:px-4 md:px-10 py-16 md:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
