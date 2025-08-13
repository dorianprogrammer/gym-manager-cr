"use client";

import Toast from "@/components/ui/Toast";
import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = {
    success: (title, message, options = {}) =>
      addToast({
        type: "success",
        title,
        message,
        ...options,
      }),
    error: (title, message, options = {}) =>
      addToast({
        type: "error",
        title,
        message,
        ...options,
      }),
    warning: (title, message, options = {}) =>
      addToast({
        type: "warning",
        title,
        message,
        ...options,
      }),
    info: (title, message, options = {}) =>
      addToast({
        type: "info",
        title,
        message,
        ...options,
      }),
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Render toasts */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              position: "absolute",
              top: `${20 + index * 80}px`,
              right: "20px",
              zIndex: 50 + index,
            }}
          >
            <Toast {...toast} isVisible={true} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
