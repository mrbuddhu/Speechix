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
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Usage & Subscription</CardTitle>
        {isGuest && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You're exploring as a guest. Sign up to save your work!
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">{totalCredits}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Used Credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div className="text-2xl font-bold">{usedCredits}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Remaining</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <div className="text-2xl font-bold">{remainingCredits}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  {subscriptionExpiry ? (
                    <>
                      <div className="text-lg font-bold">
                        {daysUntilExpiry !== null && daysUntilExpiry > 0
                          ? `${daysUntilExpiry} days`
                          : "Expired"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {subscriptionExpiry.toLocaleDateString()}
                      </div>
                    </>
                  ) : (
                    <div className="text-lg font-bold text-muted-foreground">
                      No subscription
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Usage Progress</span>
            <span>{Math.round(usagePercent)}%</span>
          </div>
          <Progress 
            value={usagePercent} 
            className={usagePercent > 90 ? "bg-destructive" : ""}
          />
        </div>
      </CardContent>
    </Card>
  );
}
