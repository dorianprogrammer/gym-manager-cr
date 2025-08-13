"use client";

import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ type = "success", title, message, isVisible, onClose, duration = 4000, position = "top-right" }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-400",
      title: "text-green-800",
      message: "text-green-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-400",
      title: "text-red-800",
      message: "text-red-700",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-400",
      title: "text-yellow-800",
      message: "text-yellow-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-400",
      title: "text-blue-800",
      message: "text-blue-700",
    },
  };

  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  const Icon = icons[type];
  const style = styles[type];

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed ${positions[position]} z-50 w-full max-w-sm`}>
      <div
        className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 transform transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${style.icon}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && <p className={`text-sm font-medium ${style.title}`}>{title}</p>}
            {message && <p className={`text-sm ${style.message} ${title ? "mt-1" : ""}`}>{message}</p>}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className={`inline-flex ${style.message} hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
