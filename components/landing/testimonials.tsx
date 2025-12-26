import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    content:
      "Speechix has completely transformed how I create content. The voices sound so natural that my audience can't believe it's AI! I've cut my production time in half.",
    avatar: "/avatars/01.png",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "E-learning Developer",
    content:
      "The variety of voices and languages available has been a game-changer for our global training programs. The API is well-documented and easy to integrate.",
    avatar: "/avatars/02.png",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Indie Game Developer",
    content:
      "I was skeptical about using AI voices for my game, but Speechix exceeded my expectations. The emotional range and clarity are perfect for character dialogue.",
    avatar: "/avatars/03.png",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <div className="mt-16 grid gap-8 md:grid-cols-3">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.name}
          className="relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h4 className="font-medium">{testimonial.name}</h4>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
          <p className="text-muted-foreground">"{testimonial.content}"</p>
          <div className="mt-4 flex">
            {[...Array(5)].map((_, i) => (
              <Icons.star
                key={i}
                className={`h-5 w-5 ${
                  i < testimonial.rating ? "text-yellow-400" : "text-muted"
                }`}
                fill={i < testimonial.rating ? "currentColor" : "none"}
              />
            ))}
          </div>
          <Icons.quote className="absolute right-4 top-4 h-8 w-8 text-muted/20" />
        </div>
      ))}
    </div>
  );
}
