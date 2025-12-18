"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import UsageOverview from "@/components/UsageOverview";
import VoiceGeneration from "@/components/VoiceGeneration";
import VoiceStudio from "@/components/VoiceStudio";
import GenerationHistory from "@/components/GenerationHistory";
import AccountSection from "@/components/AccountSection";
import { auth, User } from "@/lib/auth";
import { authAPI } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { ToastProvider } from "@/components/ToastProvider";

function AppContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState("generate");
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // If guest user, use guest data
      if (auth.isGuest()) {
        setUser(auth.getUser());
        setIsLoading(false);
        return;
      }

      // Otherwise, fetch from API
      const userData = await authAPI.me();
      setUser(userData);
      auth.setAuth(auth.getToken() || "", userData);
    } catch (error) {
      // If API fails and not guest, redirect to login
      if (!auth.isGuest()) {
        showToast("Failed to load user data", "error");
        auth.clearAuth();
        router.push("/login");
      } else {
        setUser(auth.getUser());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGenerationComplete = () => {
    loadUser(); // Refresh user data to update credits
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        <main className="flex-1 lg:ml-64 p-6 lg:p-8 w-full">
          <div className="max-w-7xl mx-auto w-full space-y-8">
            {/* Usage Overview - Always visible at top */}
            <div id="overview">
              <UsageOverview user={user} />
            </div>

            {/* Generate Section */}
            <div id="generate">
              <VoiceGeneration
                user={user}
                selectedVoiceId={selectedVoiceId}
                onGenerationComplete={handleGenerationComplete}
              />
            </div>

            {/* Voices Section */}
            <div id="voices">
              <VoiceStudio
                onVoiceSelect={setSelectedVoiceId}
                selectedVoiceId={selectedVoiceId}
              />
            </div>

            {/* History Section */}
            <div id="history">
              <GenerationHistory />
            </div>

            {/* Account Section */}
            <div id="account">
              <AccountSection user={user} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <ProtectedRoute>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ProtectedRoute>
  );
}

