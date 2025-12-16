"use client";

import { User } from "@/lib/auth";
import { IoMail, IoCard, IoTime } from "react-icons/io5";

interface AccountSectionProps {
  user: User | null;
}

export default function AccountSection({ user }: AccountSectionProps) {
  const subscriptionExpiry = user?.subscriptionExpiry
    ? new Date(user.subscriptionExpiry)
    : null;

  return (
    <div className="bg-gradient-to-br from-dark-100/80 to-dark-200/80 rounded-xl shadow-lg border border-primary-500/30 backdrop-blur-sm p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Account</h2>

      <div className="space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-primary-500/30">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Account Details</p>
            <p className="text-sm text-gray-400">Manage your account information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <IoMail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white font-medium">{user?.email || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <IoCard className="w-5 h-5 text-primary-400" />
            <div>
              <p className="text-sm text-gray-400">Plan</p>
              <p className="text-white font-medium">
                {user?.plan || "Free Plan"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <IoTime className="w-5 h-5 text-accent-400" />
            <div>
              <p className="text-sm text-gray-400">Subscription Expiry</p>
              <p className="text-white font-medium">
                {subscriptionExpiry
                  ? subscriptionExpiry.toLocaleDateString()
                  : "No active subscription"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

