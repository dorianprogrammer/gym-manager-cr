"use client";

import React from "react";
import Modal from "./Modal";

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Guardar",
  cancelText = "Cancelar",
  loading = false,
  submitDisabled = false,
  size = "md",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size} closeOnOverlayClick={!loading}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Content */}
        <div className="space-y-4">{children}</div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            disabled={loading || submitDisabled}
            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
          >
            {loading ? (
              <>
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Guardando...
              </>
            ) : (
              submitText
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
