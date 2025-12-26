import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "/register",
    price: { monthly: "$19", annually: "$15" },
    description: "Perfect for individuals getting started with AI voiceovers.",
    features: [
      "10,000 characters per month",
      "50+ natural voices",
      "Basic voice emotions",
      "Email support",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "/register",
    price: { monthly: "$49", annually: "$39" },
    description: "For professionals who need more power and flexibility.",
    features: [
      "100,000 characters per month",
      "150+ natural voices",
      "Advanced voice emotions",
      "Priority support",
      "Commercial license",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "/contact",
    price: { monthly: "Custom", annually: "Custom" },
    description: "For businesses with custom requirements.",
    features: [
      "Unlimited characters",
      "All voices & languages",
      "Custom voice training",
      "24/7 dedicated support",
      "SLA & custom contracts",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <div className="mt-16">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted-foreground/20" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
            Billed monthly or save 20% annually
          </span>
        </div>
      </div>

      <div className="mt-12 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative flex flex-col rounded-2xl border ${
              tier.featured
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-muted-foreground/20"
            } p-8`}
          >
            {tier.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">
                  Most Popular
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{tier.name}</h3>
              <p className="mt-4 text-sm text-muted-foreground">
                {tier.description}
              </p>
              <div className="mt-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price.monthly}
                  </span>
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    /month
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.price.annually !== "Custom"
                    ? `or $${tier.price.annually}/month billed annually`
                    : "Contact us for pricing"}
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Icons.check className="h-5 w-5 shrink-0 text-green-500" />
                    <span className="ml-3 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              size="lg"
              className={`mt-8 w-full ${
                !tier.featured && "bg-foreground text-background hover:bg-foreground/90"
              }`}
              asChild
            >
              <a href={tier.href}>
                {tier.id === "tier-enterprise"
                  ? "Contact Sales"
                  : "Get Started"}
              </a>
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Need something else? Contact us for custom plans and enterprise solutions.</p>
      </div>
    </div>
  );
}
