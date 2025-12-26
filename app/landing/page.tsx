"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Sparkles, Globe, Shield, ArrowRight, Check, Zap, Users, TrendingUp, Play } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function EnhancedLandingPage() {
  const router = useRouter();

  const handleGuestMode = () => {
    auth.setGuest();
    router.push("/app");
  };

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
      <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/api/placeholder/1920/1080"
          >
            <source src="https://videos.pexels.com/video-files/3045163/3045163-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
        </div>

        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/80 backdrop-blur-sm text-sm mb-4 shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-medium">Powered by advanced AI</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] text-foreground drop-shadow-lg">
                <span className="block">Clone Any Voice.</span>
                <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
                  Generate Any Speech.
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
                Enterprise-grade voice synthesis platform. Create natural, human-like voices
                at scale with <span className="font-medium text-foreground">industry-leading accuracy</span> and security.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" asChild className="h-14 px-8 text-base shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-background/90 backdrop-blur-sm border">
                <Link href="/register">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={handleGuestMode} className="h-14 px-8 text-base border-2 hover:bg-background/90 backdrop-blur-sm">
                <Play className="mr-2 h-4 w-4" />
                Watch demo
              </Button>
            </div>

            <div className="pt-8 space-y-4">
              <p className="text-sm text-foreground/80 font-medium">
                No credit card required • 14-day free trial • 100 free credits
              </p>
              <div className="flex items-center justify-center gap-8 text-xs text-foreground/70">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you create professional voice content at scale
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Trusted by Thousands</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who trust Speechix for their voice generation needs
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees, cancel anytime.
            </p>
          </div>
          <Pricing />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Speechix. Can't find the answer you're looking for?
            </p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto border-2">
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
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
