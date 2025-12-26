import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

const faqs = [
  {
    question: "How does Speechix work?",
    answer:
      "Speechix uses advanced AI technology to convert text into natural-sounding speech. Simply enter your text, select a voice, and our system will generate high-quality audio in seconds.",
  },
  {
    question: "What languages and voices are supported?",
    answer:
      "We support over 50 languages and 200+ natural-sounding voices. This includes various accents, tones, and styles to suit your needs.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! We offer a free plan that includes 10,000 characters per month. You can upgrade to a paid plan at any time for more characters and additional features.",
  },
  {
    question: "How is my data used and stored?",
    answer:
      "We take your privacy seriously. Your text and generated audio are encrypted and stored securely. We don't share your data with third parties. You can delete your data at any time.",
  },
  {
    question: "Can I use the generated audio for commercial purposes?",
    answer:
      "Yes! All our paid plans include commercial usage rights. The free plan is for personal use only. Please review our terms of service for complete details.",
  },
  {
    question: "What file formats are supported for download?",
    answer:
      "You can download your audio in MP3, WAV, or OGG format. We also provide an API for direct integration with your applications.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto mt-12 max-w-3xl">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-muted-foreground/20"
          >
            <button
              className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
              onClick={() => toggleItem(index)}
            >
              <h3 className="text-lg font-medium">{faq.question}</h3>
              <Icons.chevronDown
                className={cn(
                  "h-5 w-5 transform transition-transform duration-200",
                  openIndex === index ? "rotate-180" : ""
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-200 ease-in-out",
                openIndex === index ? "max-h-96" : "max-h-0"
              )}
            >
              <div className="px-6 pb-6 pt-0 text-muted-foreground">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Still have questions?{" "}
          <a
            href="mailto:support@speechix.com"
            className="font-medium text-primary hover:underline"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}
