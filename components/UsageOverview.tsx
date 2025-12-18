"use client";

import { User } from "@/lib/auth";
import { Clock, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your account usage</p>
        </div>
      </div>

      {isGuest && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're exploring as a guest. <a href="/register" className="text-primary hover:underline font-medium">Sign up</a> to save your work and access all features.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Available credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Credits</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usedCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Credits consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Credits available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {subscriptionExpiry ? (
              <>
                <div className="text-2xl font-bold">
                  {daysUntilExpiry !== null && daysUntilExpiry > 0
                    ? `${daysUntilExpiry}`
                    : "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {daysUntilExpiry !== null && daysUntilExpiry > 0
                    ? `Days remaining`
                    : "Expired"}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">—</div>
                <p className="text-xs text-muted-foreground mt-1">No active plan</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage Overview</CardTitle>
          <CardDescription>Credit consumption this period</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Usage</span>
            <span className="font-medium">{Math.round(usagePercent)}%</span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{usedCredits.toLocaleString()} used</span>
            <span>{totalCredits.toLocaleString()} total</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
