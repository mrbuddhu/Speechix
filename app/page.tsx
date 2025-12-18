"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Sparkles, Globe, Shield, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  const router = useRouter();

  const handleGuestMode = () => {
    auth.setGuest();
    router.push("/app");
  };

  const features = [
    {
      icon: Mic,
      title: "Voice Cloning",
      description: "Create custom voices from reference audio with industry-leading accuracy.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Synthesis",
      description: "Advanced neural networks deliver natural intonation and emotion.",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Generate speech in 50+ languages with native pronunciation.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption and data privacy controls.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-semibold tracking-tight">Speechix</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="text-sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="text-sm">
                <Link href="/register">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              AI Voice Cloning
              <br />
              <span className="text-primary">for Professionals</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade voice synthesis platform. Create natural, human-like voices
              at scale with industry-leading accuracy and security.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="h-11 px-8">
              <Link href="/register">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={handleGuestMode} className="h-11 px-8">
              Explore demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Enterprise Features</h2>
            <p className="text-muted-foreground text-lg">
              Built for teams that demand reliability and performance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="border max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join leading companies using Speechix for voice synthesis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="h-11 px-8">
                <Link href="/register">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={handleGuestMode} className="h-11 px-8">
                Schedule demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Mic className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">Speechix</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Speechix, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
