"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMic, IoLogOut, IoMenu, IoClose } from "react-icons/io5";
import { auth } from "@/lib/auth";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    auth.clearAuth();
    router.push("/");
  };

  const navItems = [
    { id: "generate", label: "Generate" },
    { id: "voices", label: "Voices" },
    { id: "history", label: "History" },
    { id: "account", label: "Account" },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 mb-8 px-4">
        <IoMic className="w-8 h-8 text-primary-400" />
        <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Speechix</span>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onSectionChange(item.id);
              setIsMobileOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              activeSection === item.id
                ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50"
                : "text-gray-300 hover:bg-primary-500/20 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 pb-4">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors flex items-center gap-2"
        >
          <IoLogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-100 rounded-lg shadow-lg border border-primary-500/30 backdrop-blur-sm"
      >
        {isMobileOpen ? (
          <IoClose className="w-6 h-6 text-white" />
        ) : (
          <IoMenu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-dark-100/90 backdrop-blur-sm border-r border-primary-500/30 z-40 flex flex-col transition-transform lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

