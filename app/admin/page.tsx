"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminAPI, AdminUser, UpdateSubscriptionRequest } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { IoSearch, IoMail, IoCard, IoTime, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

function AdminContent() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state
  const [credits, setCredits] = useState("");
  const [subscriptionExpiry, setSubscriptionExpiry] = useState("");
  const [status, setStatus] = useState<"active" | "disabled">("active");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter((user) => user.email.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, users]);

  useEffect(() => {
    if (selectedUser) {
      setCredits(selectedUser.credits?.toString() || "");
      setSubscriptionExpiry(
        selectedUser.subscriptionExpiry
          ? new Date(selectedUser.subscriptionExpiry).toISOString().split("T")[0]
          : ""
      );
      setStatus(selectedUser.status || "active");
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const userList = await adminAPI.getUsers();
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (error) {
      showToast("Failed to load users", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = async (userId: string) => {
    try {
      const user = await adminAPI.getUser(userId);
      setSelectedUser(user);
    } catch (error) {
      showToast("Failed to load user details", "error");
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      const updateData: UpdateSubscriptionRequest = {
        userId: selectedUser.id,
      };

      if (credits !== "") {
        updateData.credits = parseInt(credits, 10);
      }

      if (subscriptionExpiry) {
        updateData.subscriptionExpiry = subscriptionExpiry;
      }

      updateData.status = status;

      const updatedUser = await adminAPI.updateSubscription(updateData);
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setSelectedUser(updatedUser);
      showToast("User updated successfully!", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Update failed",
        "error"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
              <p className="text-gray-600">Manage users, credits, and subscriptions</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Users List */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="relative">
                    <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by email..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading users...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? "No users found" : "No users yet"}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelect(user.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedUser?.id === user.id
                            ? "border-primary-600 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <IoMail className="w-4 h-4 text-gray-400" />
                              <p className="font-medium text-gray-900">{user.email}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Credits: {user.credits || 0}</span>
                              <span>Used: {user.usedCredits || 0}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {user.status === "active" ? (
                              <IoCheckmarkCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <IoCloseCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Details & Edit Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {selectedUser ? (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      User Details
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">{selectedUser.email}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Credits
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">{selectedUser.credits || 0}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Used Credits
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">{selectedUser.usedCredits || 0}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Credits
                        </label>
                        <input
                          type="number"
                          value={credits}
                          onChange={(e) => setCredits(e.target.value)}
                          placeholder="Enter new credit amount"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty to keep current value
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subscription Expiry
                        </label>
                        <input
                          type="date"
                          value={subscriptionExpiry}
                          onChange={(e) => setSubscriptionExpiry(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) =>
                            setStatus(e.target.value as "active" | "disabled")
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="disabled">Disabled</option>
                        </select>
                      </div>

                      <button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? "Updating..." : "Update User"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>Select a user to view and edit details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <ToastProvider>
        <AdminContent />
      </ToastProvider>
    </ProtectedRoute>
  );
}

