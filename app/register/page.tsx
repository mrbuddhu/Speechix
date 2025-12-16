"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { authAPI } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { IoMic, IoMail, IoLockClosed } from "react-icons/io5";

function RegisterContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register(email, password);
      auth.setAuth(response.token, response.user);
      showToast("Account created successfully!", "success");
      setTimeout(() => {
        router.push("/app");
      }, 500);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Registration failed. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-8">
            <IoMic className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">Speechix</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Create Account
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Get started with Speechix today
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <IoMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <IoLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <IoLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <ToastProvider>
      <RegisterContent />
    </ToastProvider>
  );
}

