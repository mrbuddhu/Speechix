"use client";

import { useState, useEffect } from "react";
import { ttsAPI, TTSRequest } from "@/lib/api";
import { User } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";
import { Play, Stop, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VoiceGenerationProps {
  user: User | null;
  selectedVoiceId?: string;
  onGenerationComplete: () => void;
}

export default function VoiceGeneration({
  user,
  selectedVoiceId,
  onGenerationComplete,
}: VoiceGenerationProps) {
  const { showToast } = useToast();
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const maxLength = 5000;

  const remainingCredits = (user?.credits || 0) - (user?.usedCredits || 0);
  const canGenerate = remainingCredits > 0 && !isGenerating;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isGenerating && generationId) {
      interval = setInterval(async () => {
        try {
          const response = await ttsAPI.status(generationId);
          setStatus(response.status);

          if (response.status === "completed") {
            setIsGenerating(false);
            setGenerationId(null);
            setStatus("");
            showToast("Voice generation completed!", "success");
            onGenerationComplete();
          } else if (response.status === "failed") {
            setIsGenerating(false);
            setGenerationId(null);
            setStatus("");
            showToast(
              response.error || "Generation failed",
              "error"
            );
          }
        } catch (error) {
          console.error("Status check failed:", error);
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, generationId, showToast, onGenerationComplete]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      showToast("Please enter text to generate", "error");
      return;
    }

    if (!selectedVoiceId) {
      showToast("Please select a voice first", "error");
      return;
    }

    setIsGenerating(true);
    setStatus("pending");

    try {
      const request: TTSRequest = {
        text: text.trim(),
        voiceId: selectedVoiceId,
        language,
      };

      const response = await ttsAPI.submit(request);
      setGenerationId(response.id);
      setStatus(response.status);
    } catch (error) {
      setIsGenerating(false);
      setStatus("");
      showToast(
        error instanceof Error ? error.message : "Generation failed",
        "error"
      );
    }
  };

  const handleCancel = async () => {
    if (generationId) {
      try {
        await ttsAPI.cancel(generationId);
      } catch (error) {
        console.error("Cancel failed:", error);
      }
    }
    setIsGenerating(false);
    setGenerationId(null);
    setStatus("");
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Voice Generation</CardTitle>
        <CardDescription>
          Transform your text into natural-sounding speech
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!canGenerate && !isGenerating && (
          <Alert variant={remainingCredits <= 0 ? "destructive" : "default"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {remainingCredits <= 0
                ? "You have no remaining credits. Please contact support to add more credits."
                : "Please select a voice from the Voice Studio section."}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="text">Text to Generate</Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setText(e.target.value);
              }
            }}
            rows={6}
            placeholder="Enter the text you want to convert to speech..."
            disabled={!canGenerate}
            className="resize-none"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{text.length} / {maxLength} characters</span>
            <span>{Math.ceil(text.length / 100)} credits needed</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage} disabled={!canGenerate}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Selected Voice</Label>
            <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center">
              {selectedVoiceId ? (
                <span className="text-sm font-medium">Voice Selected</span>
              ) : (
                <span className="text-sm text-muted-foreground">No voice selected</span>
              )}
            </div>
          </div>
        </div>

        {status && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Status: <span className="font-medium capitalize">{status}</span>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="flex-1"
            size="lg"
          >
            <Play className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Voice"}
          </Button>

          {isGenerating && (
            <Button
              onClick={handleCancel}
              variant="destructive"
              size="lg"
            >
              <Stop className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
