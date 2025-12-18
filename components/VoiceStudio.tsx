"use client";

import { useState, useEffect, useRef } from "react";
import { voicesAPI, Voice } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { Mic, Upload, Play, Stop, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VoiceStudioProps {
  onVoiceSelect: (voiceId: string) => void;
  selectedVoiceId?: string;
}

export default function VoiceStudio({
  onVoiceSelect,
  selectedVoiceId,
}: VoiceStudioProps) {
  const { showToast } = useToast();
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    setIsLoading(true);
    try {
      const voiceList = await voicesAPI.list();
      setVoices(voiceList);
    } catch (error) {
      showToast("Failed to load voices", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      showToast("Please upload an audio file", "error");
      return;
    }

    setIsUploading(true);
    try {
      const newVoice = await voicesAPI.upload(file);
      setVoices((prev) => [...prev, newVoice]);
      showToast("Voice uploaded successfully!", "success");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecord = async () => {
    if (isRecording) {
      setIsRecording(false);
      showToast("Recording stopped. Processing...", "success");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        showToast("Recording started. Click again to stop.", "success");
      } catch (error) {
        showToast("Microphone access denied", "error");
      }
    }
  };

  const handlePlay = (voice: Voice) => {
    if (!voice.audioUrl) return;

    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    if (!audioRefs.current[voice.id]) {
      audioRefs.current[voice.id] = new Audio(voice.audioUrl);
      audioRefs.current[voice.id].onended = () => setPlayingId(null);
    }

    const audio = audioRefs.current[voice.id];
    audio.play();
    setPlayingId(voice.id);
  };

  const handleStop = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setPlayingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Studio</CardTitle>
        <CardDescription>
          Manage your voice models and reference audio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Card
            className={cn(
              "border-2 border-dashed cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/50",
              isUploading && "border-primary bg-accent/50"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="voice-upload"
              />
              {isUploading ? (
                <Upload className="w-8 h-8 text-primary mb-3" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground mb-3" />
              )}
              <h3 className="font-medium mb-1">Upload Audio</h3>
              <p className="text-sm text-muted-foreground">
                {isUploading ? "Uploading..." : "Select audio file"}
              </p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border-2 border-dashed cursor-pointer transition-colors",
              isRecording
                ? "border-destructive bg-destructive/5 hover:bg-destructive/10"
                : "hover:border-primary/50 hover:bg-accent/50"
            )}
            onClick={handleRecord}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Mic
                className={cn(
                  "w-8 h-8 mb-3",
                  isRecording ? "text-destructive" : "text-muted-foreground"
                )}
              />
              <h3 className="font-medium mb-1">
                {isRecording ? "Recording..." : "Record Audio"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRecording ? "Click to stop" : "Click to start"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Voice Models</h3>
              <p className="text-sm text-muted-foreground">{voices.length} available</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Loading...
            </div>
          ) : voices.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Mic className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No voice models yet. Upload or record audio to create one.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {voices.map((voice) => (
                <Card
                  key={voice.id}
                  className={cn(
                    "transition-colors",
                    selectedVoiceId === voice.id && "border-primary"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {selectedVoiceId === voice.id && (
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{voice.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(voice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {voice.audioUrl && (
                          <>
                            {playingId === voice.id ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleStop}
                              >
                                <Stop className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePlay(voice)}
                              >
                                <Play className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </>
                        )}
                        <Button
                          variant={selectedVoiceId === voice.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => onVoiceSelect(voice.id)}
                          className="h-8"
                        >
                          {selectedVoiceId === voice.id ? "Active" : "Select"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
