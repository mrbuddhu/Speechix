"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Sparkles, Globe, Shield, ArrowRight, Check } from "lucide-react";
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
      description: "Clone any voice with just a few seconds of audio. Create personalized voices that sound natural and authentic.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Advanced AI technology ensures high-quality voice synthesis with natural intonation and emotion.",
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Support for multiple languages and accents. Generate speech in the language you need.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your voice data is encrypted and stored securely. Full control over your generated content.",
    },
  ];

  const benefits = [
    "Unlimited voice generations",
    "High-quality audio output",
    "Real-time processing",
    "Custom voice training",
    "API access available",
    "24/7 customer support",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Speechix
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-sm mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI-Powered Voice Cloning Technology</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
            AI That Speaks
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Exactly Like You
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create natural, human-like voices with AI voice cloning technology.
            Transform text into speech that sounds exactly like you or any voice you choose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="text-base px-8">
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="lg" variant="secondary" onClick={handleGuestMode} className="text-base px-8">
              Try as Guest
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            No credit card required • 100 free credits to start
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-primary/10">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you create professional voice content
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="border-2 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators using Speechix to bring their content to life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base px-8">
                <Link href="/register">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={handleGuestMode} className="text-base px-8">
                Try as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold">Speechix</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Speechix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
