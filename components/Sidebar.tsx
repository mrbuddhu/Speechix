"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mic, LogOut, Menu, X, Sparkles, History, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    { id: "generate", label: "Generate", icon: Sparkles },
    { id: "voices", label: "Voices", icon: Mic },
    { id: "history", label: "History", icon: History },
    { id: "account", label: "Account", icon: User },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2.5 px-6 py-5 border-b">
        <div className="p-1.5 rounded-md bg-primary/10">
          <Mic className="w-4 h-4 text-primary" />
        </div>
        <span className="text-base font-semibold tracking-tight">Speechix</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start font-normal",
                activeSection === item.id && "bg-accent text-accent-foreground"
              )}
              onClick={() => {
                onSectionChange(item.id);
                setIsMobileOpen(false);
              }}
            >
              <Icon className="mr-2.5 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2.5 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 w-64 border-r bg-card z-40 flex flex-col transition-transform",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
