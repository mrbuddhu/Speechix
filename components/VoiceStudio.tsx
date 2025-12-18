"use client";

import { useState, useEffect, useRef } from "react";
import { voicesAPI, Voice } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { Mic, CloudUpload, Play, Stop, CheckCircle2, Upload } from "lucide-react";
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
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Voice Studio</CardTitle>
        <CardDescription>
          Upload or record reference audio to create custom voices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload and Record Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card
            className={cn(
              "border-2 border-dashed cursor-pointer transition-all hover:border-primary hover:bg-accent/5",
              isUploading && "border-primary bg-accent/5"
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
                <Upload className="w-12 h-12 text-primary animate-pulse mb-4" />
              ) : (
                <CloudUpload className="w-12 h-12 text-muted-foreground mb-4" />
              )}
              <h3 className="font-semibold mb-2">Upload Reference Audio</h3>
              <p className="text-sm text-muted-foreground">
                {isUploading ? "Uploading..." : "Click to browse audio files"}
              </p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border-2 border-dashed cursor-pointer transition-all",
              isRecording
                ? "border-destructive bg-destructive/5 hover:bg-destructive/10"
                : "hover:border-primary hover:bg-accent/5"
            )}
            onClick={handleRecord}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Mic
                className={cn(
                  "w-12 h-12 mb-4",
                  isRecording
                    ? "text-destructive animate-pulse"
                    : "text-muted-foreground"
                )}
              />
              <h3 className="font-semibold mb-2">
                {isRecording ? "Recording..." : "Record from Microphone"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRecording ? "Click to stop recording" : "Click to start recording"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Voices List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Voices</h3>
            <span className="text-sm text-muted-foreground">{voices.length} voices</span>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading voices...
            </div>
          ) : voices.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No voices yet. Upload or record a voice to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {voices.map((voice) => (
                <Card
                  key={voice.id}
                  className={cn(
                    "transition-all hover:shadow-md",
                    selectedVoiceId === voice.id && "border-primary border-2 shadow-md"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {selectedVoiceId === voice.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                        <div>
                          <p className="font-medium">{voice.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(voice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {voice.audioUrl && (
                          <>
                            {playingId === voice.id ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleStop}
                              >
                                <Stop className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePlay(voice)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                        <Button
                          variant={selectedVoiceId === voice.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => onVoiceSelect(voice.id)}
                        >
                          {selectedVoiceId === voice.id ? "Selected" : "Select"}
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
