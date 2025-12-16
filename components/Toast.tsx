"use client";

import { useEffect } from "react";
import { IoClose, IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        type === "success"
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200"
      } animate-in slide-in-from-top-5`}
    >
      {type === "success" ? (
        <IoCheckmarkCircle className="w-5 h-5" />
      ) : (
        <IoAlertCircle className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <IoClose className="w-5 h-5" />
      </button>
    </div>
  );
}

