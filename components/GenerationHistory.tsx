"use client";

import { useState, useEffect, useRef } from "react";
import { ttsAPI, TTSHistoryItem } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { Play, Stop, Download, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Generation History</CardTitle>
            <CardDescription>
              View and manage your generated audio files
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={loadHistory}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Loading...
          </div>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No generation history. Generate your first voice to see it here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <Card key={item.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="font-medium text-sm line-clamp-2">{item.text}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                        <Badge variant={getStatusVariant(item.status)} className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    </div>

                    {item.audioUrl && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {playingId === item.id ? (
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
                            onClick={() => handlePlay(item)}
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDownload(item)}
                        >
                          <Download className="h-3.5 w-3.5" />
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
