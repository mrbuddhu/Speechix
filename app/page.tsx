"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Sparkles, Globe, Shield, ArrowRight, Check, Zap, Users, TrendingUp, Play } from "lucide-react";
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
      color: "text-blue-500",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Synthesis",
      description: "Advanced neural networks deliver natural intonation and emotion.",
      color: "text-purple-500",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Generate speech in 50+ languages with native pronunciation.",
      color: "text-green-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption and data privacy controls.",
      color: "text-orange-500",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Voices Generated", value: "1M+", icon: Mic },
    { label: "Uptime", value: "99.9%", icon: TrendingUp },
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
      <section className="relative container mx-auto px-6 py-20 lg:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/80 backdrop-blur-sm text-sm mb-4 shadow-sm hover:shadow-md transition-shadow">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-medium">Powered by advanced AI</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1]">
              <span className="block">Clone Any Voice.</span>
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Generate Any Speech.
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Enterprise-grade voice synthesis platform. Create natural, human-like voices
              at scale with <span className="font-medium text-foreground">industry-leading accuracy</span> and security.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" asChild className="h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Link href="/register">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={handleGuestMode} className="h-14 px-8 text-base border-2 hover:bg-accent">
              <Play className="mr-2 h-4 w-4" />
              Watch demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              No credit card required • 14-day free trial • 100 free credits
            </p>
            <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 hidden lg:block">
          <Card className="w-64 p-4 border shadow-lg bg-background/80 backdrop-blur-sm animate-float">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Voice Quality</p>
                <p className="text-xs text-muted-foreground">99.9% accuracy</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-0 hidden lg:block">
          <Card className="w-64 p-4 border shadow-lg bg-background/80 backdrop-blur-sm animate-float-delayed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Processing Speed</p>
                <p className="text-xs text-muted-foreground">Real-time generation</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you create professional voice content at scale
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border hover:shadow-xl transition-all duration-300 hover:border-primary/50 group hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                      <Icon className="w-6 h-6" />
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

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">Why Choose Speechix?</h2>
                <p className="text-muted-foreground">Trusted by leading companies worldwide</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "Industry-leading voice quality",
                  "99.9% uptime guarantee",
                  "Enterprise-grade security",
                  "Real-time processing",
                  "50+ language support",
                  "24/7 customer support",
                  "API access included",
                  "No usage limits on pro plans",
                ].map((benefit, index) => (
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

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="border-2 max-w-4xl mx-auto bg-gradient-to-br from-background to-muted/30">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators and businesses using Speechix to bring their content to life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Link href="/register">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={handleGuestMode} className="h-12 px-8 text-base">
                Try demo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              No credit card required • Cancel anytime • 14-day money-back guarantee
            </p>
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
