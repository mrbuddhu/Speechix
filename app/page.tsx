"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoMic, IoSparkles, IoGlobe, IoShieldCheckmark } from "react-icons/io5";
import { auth } from "@/lib/auth";

export default function LandingPage() {
  const router = useRouter();

  const handleGuestMode = () => {
    auth.setGuest();
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-dark-100 to-dark-200">
      {/* Header */}
      <header className="border-b border-primary-500/30 bg-dark-50/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <IoMic className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Speechix</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-primary-500/20 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all font-medium shadow-lg shadow-primary-500/50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Speechix
            <br />
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-pink-400 bg-clip-text text-transparent">AI That Speaks Like You</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create natural, human-like voices with AI voice cloning technology.
            Transform text into speech that sounds exactly like you or any voice
            you choose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all font-semibold text-lg shadow-lg shadow-primary-500/50"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="border-2 border-primary-500 text-white px-8 py-4 rounded-lg hover:bg-primary-500/20 transition-colors font-semibold text-lg"
            >
              Sign In
            </Link>
            <button
              onClick={handleGuestMode}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg shadow-lg shadow-purple-500/50"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-primary-500/20 to-accent-500/20 p-6 rounded-xl border border-primary-500/30 backdrop-blur-sm hover:border-primary-400 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center mb-4">
              <IoMic className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Voice Cloning
            </h3>
            <p className="text-gray-300">
              Clone any voice with just a few seconds of audio. Create
              personalized voices that sound natural and authentic.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-purple-500/30 backdrop-blur-sm hover:border-purple-400 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-4">
              <IoSparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              AI-Powered
            </h3>
            <p className="text-gray-300">
              Advanced AI technology ensures high-quality voice synthesis with
              natural intonation and emotion.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-500/30 backdrop-blur-sm hover:border-blue-400 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center mb-4">
              <IoGlobe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Multi-Language
            </h3>
            <p className="text-gray-300">
              Support for multiple languages and accents. Generate speech in the
              language you need.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-500/30 backdrop-blur-sm hover:border-green-400 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center mb-4">
              <IoShieldCheckmark className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-300">
              Your voice data is encrypted and stored securely. Full control over
              your generated content.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-500/30 bg-dark-50/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <IoMic className="w-6 h-6 text-primary-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Speechix</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Speechix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

