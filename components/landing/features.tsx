import { Icons } from "@/components/icons";

const features = [
  {
    name: "Natural Sounding Voices",
    description:
      "Our AI generates human-like voices with natural intonation and emotion.",
    icon: Icons.volume2,
  },
  {
    name: "100+ Voice Options",
    description:
      "Choose from a wide variety of voices across different languages and accents.",
    icon: Icons.voice,
  },
  {
    name: "Lightning Fast",
    description:
      "Generate high-quality audio in seconds, not minutes. Perfect for content creators on the go.",
    icon: Icons.zap,
  },
  {
    name: "Easy Integration",
    description:
      "Simple API and plugins for all major platforms. Get started in minutes.",
    icon: Icons.code,
  },
  {
    name: "Custom Voices",
    description:
      "Create and train custom voice models that sound exactly how you want.",
    icon: Icons.mic,
  },
  {
    name: "Secure & Private",
    description:
      "Your data stays yours. We don't store your audio files without permission.",
    icon: Icons.shield,
  },
];

export function Features() {
  return (
    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.name}
          className="group relative overflow-hidden rounded-xl border bg-background p-6 transition-all hover:shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <feature.icon className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{feature.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {feature.description}
          </p>
          <div className="absolute -right-8 -bottom-8 h-16 w-16 rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-150" />
        </div>
      ))}
    </div>
  );
}
