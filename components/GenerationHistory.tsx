"use client";

import { useState, useEffect, useRef } from "react";
import { ttsAPI, TTSHistoryItem } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { Play, Stop, Download, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function GenerationHistory() {
  const { showToast } = useToast();
  const [history, setHistory] = useState<TTSHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const historyList = await ttsAPI.history();
      setHistory(historyList);
    } catch (error) {
      showToast("Failed to load history", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (item: TTSHistoryItem) => {
    if (!item.audioUrl) return;

    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    if (!audioRefs.current[item.id]) {
      audioRefs.current[item.id] = new Audio(item.audioUrl);
      audioRefs.current[item.id].onended = () => setPlayingId(null);
    }

    const audio = audioRefs.current[item.id];
    audio.play();
    setPlayingId(item.id);
  };

  const handleStop = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setPlayingId(null);
  };

  const handleDownload = (item: TTSHistoryItem) => {
    if (!item.audioUrl) {
      showToast("No audio file available", "error");
      return;
    }

    const link = document.createElement("a");
    link.href = item.audioUrl;
    link.download = `speechix-${item.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Generation History</CardTitle>
            <CardDescription>
              View and manage your generated voice recordings
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={loadHistory}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No generation history yet. Generate your first voice to see it here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <Card
                key={item.id}
                className="transition-all hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <p className="font-medium line-clamp-2">{item.text}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>

                    {item.audioUrl && (
                      <div className="flex items-center gap-2">
                        {playingId === item.id ? (
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
                            onClick={() => handlePlay(item)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(item)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
