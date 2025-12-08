"use client";
import React from "react";

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({
  isOpen,
  title = "Error",
  message,
  onClose,
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center animate-[fadeIn_0.25s_ease-out]">

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl">
            ✕
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-5">{message}</p>

        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
}
