"use client";

import { useState, useEffect, useRef } from "react";
import { ttsAPI, TTSHistoryItem } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { IoPlay, IoStop, IoDownload, IoTime } from "react-icons/io5";

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

    // Stop any currently playing audio
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    // Play the selected audio
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

  return (
    <div className="bg-gradient-to-br from-dark-100/80 to-dark-200/80 rounded-xl shadow-lg border border-primary-500/30 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Generation History</h2>
        <button
          onClick={loadHistory}
          className="text-sm text-primary-400 hover:text-primary-300 font-medium"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No generation history yet. Generate your first voice to see it here.
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="border border-primary-500/30 rounded-lg p-4 hover:border-primary-400 bg-dark-200/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white font-medium mb-2 line-clamp-2">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <IoTime className="w-4 h-4" />
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : item.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {item.audioUrl && (
                  <div className="flex items-center gap-2">
                    {playingId === item.id ? (
                      <button
                        onClick={handleStop}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Stop"
                      >
                        <IoStop className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlay(item)}
                        className="p-2 text-primary-400 hover:bg-primary-500/20 rounded-lg transition-colors"
                        title="Play"
                      >
                        <IoPlay className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(item)}
                        className="p-2 text-gray-400 hover:bg-dark-200/50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <IoDownload className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

