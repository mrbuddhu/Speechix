"use client";

import { User } from "@/lib/auth";
import { IoTime, IoCard, IoCheckmarkCircle } from "react-icons/io5";

interface UsageOverviewProps {
  user: User | null;
}

export default function UsageOverview({ user }: UsageOverviewProps) {
  const totalCredits = user?.credits || 0;
  const usedCredits = user?.usedCredits || 0;
  const remainingCredits = totalCredits - usedCredits;
  const usagePercent = totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0;
  const subscriptionExpiry = user?.subscriptionExpiry
    ? new Date(user.subscriptionExpiry)
    : null;
  const daysUntilExpiry = subscriptionExpiry
    ? Math.ceil((subscriptionExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const isGuest = user?.id === "guest";

  return (
    <div className="bg-gradient-to-br from-dark-100/80 to-dark-200/80 rounded-xl shadow-lg border border-primary-500/30 backdrop-blur-sm p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Usage & Subscription</h2>
      {isGuest && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
          <p className="text-sm text-purple-300">👤 You're exploring as a guest. Sign up to save your work!</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg p-4 border border-primary-500/30">
          <div className="flex items-center gap-2 mb-2">
            <IoCard className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-gray-300">Total Credits</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalCredits}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <IoCheckmarkCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-300">Used Credits</span>
          </div>
          <p className="text-2xl font-bold text-white">{usedCredits}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <IoCard className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-300">Remaining</span>
          </div>
          <p className="text-2xl font-bold text-white">{remainingCredits}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg p-4 border border-orange-500/30">
          <div className="flex items-center gap-2 mb-2">
            <IoTime className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-300">Subscription</span>
          </div>
          {subscriptionExpiry ? (
            <div>
              <p className="text-lg font-bold text-white">
                {daysUntilExpiry !== null && daysUntilExpiry > 0
                  ? `${daysUntilExpiry} days`
                  : "Expired"}
              </p>
              <p className="text-xs text-gray-400">
                {subscriptionExpiry.toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold text-gray-400">No subscription</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Usage Progress</span>
          <span>{Math.round(usagePercent)}%</span>
        </div>
        <div className="w-full bg-dark-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              usagePercent > 90
                ? "bg-gradient-to-r from-red-500 to-pink-500"
                : usagePercent > 70
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : "bg-gradient-to-r from-primary-500 to-accent-500"
            }`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

