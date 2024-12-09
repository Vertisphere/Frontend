"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Layers, NotebookPen, History, Cuboid } from "lucide-react";
import logo from "@/public/icon.svg";
// import { auth } from "@/config/firebase";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Orders", href: "/franchisee/orders", icon: Cuboid },
  { label: "Place Order", href: "/franchisee/place-order", icon: Layers },
  {
    label: "Orders History",
    href: "/franchisee/orders-history",
    icon: NotebookPen,
  },
];

export default function FranchiseeSidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white w-64 shadow-lg z-40 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative`}
      >
        <div className="p-4 mt-4">
          <Image
            src={logo}
            alt="Chef's Door"
            width={150}
            height={50}
            className="mx-auto"
          />
        </div>

        <div className="text-left text-sm text-gray-500 px-8 py-4">
          Main Menu
        </div>
        <nav className="flex flex-col h-[calc(100vh-140px)]">
          <ul className="space-y-2 flex-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 mx-4 text-gray-700 hover:bg-blue-100 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 font-medium rounded-lg"
                      : "border-l-4 border-transparent"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="p-4">
            <Button
              onClick={() => {
                // signOut(auth);
              }}
              className="w-full py-2 px-4 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              Logout
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
}
