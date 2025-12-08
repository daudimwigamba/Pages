"use client";
import React from "react";

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({
  isOpen,
  title = "Success",
  message,
  onClose,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center animate-[fadeIn_0.25s_ease-out]">

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl">
            ✓
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-5">{message}</p>

        <button
          onClick={onClose}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
}
