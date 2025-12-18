"use client";

import { User } from "@/lib/auth";
import { Mail, CreditCard, Clock, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AccountSectionProps {
  user: User | null;
}

export default function AccountSection({ user }: AccountSectionProps) {
  const subscriptionExpiry = user?.subscriptionExpiry
    ? new Date(user.subscriptionExpiry)
    : null;

  const getInitials = (email?: string) => {
    if (!email) return "U";
    return email[0].toUpperCase();
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {getInitials(user?.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">Account Details</p>
            <p className="text-sm text-muted-foreground">
              Your account information and subscription
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-muted">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-muted">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="font-medium">{user?.plan || "Free Plan"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-muted">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subscription Expiry</p>
              <p className="font-medium">
                {subscriptionExpiry
                  ? subscriptionExpiry.toLocaleDateString()
                  : "No active subscription"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
