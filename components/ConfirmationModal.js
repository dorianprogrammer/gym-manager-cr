"use client";

import React from "react";
import Modal from "./Modal";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "red", // red, blue, green, yellow
  loading = false,
  icon = null,
}) {
  const colorClasses = {
    red: {
      button: "bg-red-600 hover:bg-red-500 text-white",
      icon: "bg-red-100 text-red-600",
    },
    blue: {
      button: "bg-blue-600 hover:bg-blue-500 text-white",
      icon: "bg-blue-100 text-blue-600",
    },
    green: {
      button: "bg-green-600 hover:bg-green-500 text-white",
      icon: "bg-green-100 text-green-600",
    },
    yellow: {
      button: "bg-yellow-600 hover:bg-yellow-500 text-white",
      icon: "bg-yellow-100 text-yellow-600",
    },
  };

  const colors = colorClasses[confirmColor];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false} closeOnOverlayClick={!loading}>
      <div className="sm:flex sm:items-start">
        {icon && (
          <div
            className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colors.icon} sm:mx-0 sm:h-10 sm:w-10`}
          >
            {icon}
          </div>
        )}
        <div className={`mt-3 text-center sm:mt-0 sm:text-left ${icon ? "sm:ml-4" : ""}`}>
          <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>
          {message && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">{message}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto ${colors.button}`}
        >
          {loading ? (
            <>
              <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Procesando...
            </>
          ) : (
            confirmText
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 sm:mt-0 sm:w-auto"
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  );
}
