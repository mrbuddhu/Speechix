"use client";

import { useState, useEffect } from "react";
import { ttsAPI, TTSRequest } from "@/lib/api";
import { User } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";
import { IoPlay, IoStop, IoMic } from "react-icons/io5";

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
    <div className="bg-gradient-to-br from-dark-100/80 to-dark-200/80 rounded-xl shadow-lg border border-primary-500/30 backdrop-blur-sm p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Voice Generation</h2>

      {!canGenerate && !isGenerating && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <p className="text-yellow-300 text-sm">
            {remainingCredits <= 0
              ? "You have no remaining credits. Please contact support to add more credits."
              : "Please select a voice from the Voice Studio section."}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Text to Generate
          </label>
          <textarea
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setText(e.target.value);
              }
            }}
            rows={6}
            className="w-full px-4 py-3 bg-dark-200/50 border border-primary-500/30 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400 outline-none resize-none text-white placeholder-gray-500"
            placeholder="Enter the text you want to convert to speech..."
            disabled={!canGenerate}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>{text.length} / {maxLength} characters</span>
            <span>{Math.ceil(text.length / 100)} credits needed</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-dark-200/50 border border-primary-500/30 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-400 outline-none text-white"
              disabled={!canGenerate}
            >
              <option value="en" className="bg-dark-200">English</option>
              <option value="es" className="bg-dark-200">Spanish</option>
              <option value="fr" className="bg-dark-200">French</option>
              <option value="de" className="bg-dark-200">German</option>
              <option value="it" className="bg-dark-200">Italian</option>
              <option value="pt" className="bg-dark-200">Portuguese</option>
              <option value="ja" className="bg-dark-200">Japanese</option>
              <option value="zh" className="bg-dark-200">Chinese</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Selected Voice
            </label>
            <div className="px-4 py-3 bg-dark-200/50 border border-primary-500/30 rounded-lg">
              {selectedVoiceId ? (
                <span className="text-white font-medium">Voice Selected</span>
              ) : (
                <span className="text-gray-500">No voice selected</span>
              )}
            </div>
          </div>
        </div>

        {status && (
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              Status: <span className="font-medium capitalize">{status}</span>
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-500/50"
          >
            <IoPlay className="w-5 h-5" />
            {isGenerating ? "Generating..." : "Generate Voice"}
          </button>

          {isGenerating && (
            <button
              onClick={handleCancel}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-500/50"
            >
              <IoStop className="w-5 h-5" />
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
