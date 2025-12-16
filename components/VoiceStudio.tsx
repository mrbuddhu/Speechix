"use client";

import { useState, useEffect, useRef } from "react";
import { voicesAPI, Voice } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { IoMic, IoCloudUpload, IoPlay, IoStop, IoCheckmarkCircle } from "react-icons/io5";

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
      // Stop recording logic would go here
      setIsRecording(false);
      showToast("Recording stopped. Processing...", "success");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        // Recording implementation would go here
        // For now, just show a message
        showToast("Recording started. Click again to stop.", "success");
      } catch (error) {
        showToast("Microphone access denied", "error");
      }
    }
  };

  const handlePlay = (voice: Voice) => {
    if (!voice.audioUrl) return;

    // Stop any currently playing audio
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    // Play the selected audio
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
    <div className="bg-gradient-to-br from-dark-100/80 to-dark-200/80 rounded-xl shadow-lg border border-primary-500/30 backdrop-blur-sm p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Voice Studio</h2>

      <div className="space-y-6">
        {/* Upload and Record Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-primary-500/30 rounded-lg p-6 text-center hover:border-primary-400 transition-colors bg-dark-200/30">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="voice-upload"
            />
            <label
              htmlFor="voice-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <IoCloudUpload className="w-8 h-8 text-primary-400" />
              <span className="text-sm font-medium text-gray-300">
                Upload Reference Audio
              </span>
              <span className="text-xs text-gray-400">
                {isUploading ? "Uploading..." : "Click to browse"}
              </span>
            </label>
          </div>

          <button
            onClick={handleRecord}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors flex flex-col items-center gap-3 ${
              isRecording
                ? "border-red-400 bg-red-500/20"
                : "border-primary-500/30 hover:border-primary-400 bg-dark-200/30"
            }`}
          >
              <IoMic
                className={`w-8 h-8 ${
                  isRecording ? "text-red-400" : "text-primary-400"
                }`}
              />
              <span className="text-sm font-medium text-gray-300">
                {isRecording ? "Recording..." : "Record from Microphone"}
              </span>
              <span className="text-xs text-gray-400">
              {isRecording ? "Click to stop" : "Click to start"}
            </span>
          </button>
        </div>

        {/* Voices List */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Your Voices ({voices.length})
          </h3>

          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Loading voices...</div>
          ) : voices.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No voices yet. Upload or record a voice to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {voices.map((voice) => (
                <div
                  key={voice.id}
                  className={`border rounded-lg p-4 flex items-center justify-between ${
                    selectedVoiceId === voice.id
                      ? "border-primary-500 bg-gradient-to-r from-primary-500/20 to-accent-500/20"
                      : "border-primary-500/30 bg-dark-200/30"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {selectedVoiceId === voice.id && (
                      <IoCheckmarkCircle className="w-5 h-5 text-primary-600" />
                    )}
                    <div>
                      <p className="font-medium text-white">{voice.name}</p>
                      <p className="text-sm text-gray-400">
                        Created {new Date(voice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {voice.audioUrl && (
                      <>
                        {playingId === voice.id ? (
                          <button
                            onClick={handleStop}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <IoStop className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePlay(voice)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <IoPlay className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => onVoiceSelect(voice.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedVoiceId === voice.id
                          ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50"
                          : "bg-dark-200/50 text-gray-300 hover:bg-primary-500/20 hover:text-white border border-primary-500/30"
                      }`}
                    >
                      {selectedVoiceId === voice.id ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

