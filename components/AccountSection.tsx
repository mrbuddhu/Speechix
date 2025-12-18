"use client";

import { User } from "@/lib/auth";
import { Mail, CreditCard, Clock } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account information and subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(user?.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Account</p>
            <p className="text-sm text-muted-foreground">Profile information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-md bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Email</p>
              <p className="text-sm font-medium">{user?.email || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-md bg-muted">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Plan</p>
              <p className="text-sm font-medium">{user?.plan || "Free"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-md bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Subscription</p>
              <p className="text-sm font-medium">
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
