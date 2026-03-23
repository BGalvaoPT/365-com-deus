"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
  type?: "success" | "info" | "warning";
  duration?: number;
}

export function Toast({
  message,
  show,
  onHide,
  type = "success",
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onHide, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onHide, duration]);

  if (!show) return null;

  const colors = {
    success: "bg-emerald-600",
    info: "bg-gold-600",
    warning: "bg-amber-600",
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
      <div
        className={`${colors[type]} text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg`}
      >
        {message}
      </div>
    </div>
  );
}
