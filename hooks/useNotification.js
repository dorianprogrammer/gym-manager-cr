"use client";

import { useToast } from "@/contexts/ToastContext";

export const useNotification = () => {
  const { showToast } = useToast();

  return {
    // Success notifications
    success: (message, title = "¡Éxito!") => {
      showToast.success(title, message);
    },

    // Error notifications
    error: (message, title = "Error") => {
      showToast.error(title, message);
    },

    // Warning notifications
    warning: (message, title = "Advertencia") => {
      showToast.warning(title, message);
    },

    // Info notifications
    info: (message, title = "Información") => {
      showToast.info(title, message);
    },

    // Gym-specific notifications
    memberAdded: (memberName) => {
      showToast.success("¡Miembro agregado!", `${memberName} ha sido agregado exitosamente al gimnasio.`);
    },

    memberUpdated: (memberName) => {
      showToast.success("¡Miembro actualizado!", `Los datos de ${memberName} han sido actualizados.`);
    },

    memberDeleted: (memberName) => {
      showToast.success("Miembro eliminado", `${memberName} ha sido eliminado del sistema.`);
    },

    memberStatusChanged: (memberName, isActive) => {
      showToast.info("Estado actualizado", `${memberName} ha sido ${isActive ? "activado" : "desactivado"}.`);
    },

    paymentProcessed: (amount, memberName) => {
      showToast.success("Pago procesado", `Pago de ₡${amount.toLocaleString()} registrado para ${memberName}.`);
    },

    checkInRegistered: (memberName) => {
      showToast.success("Check-in registrado", `${memberName} ha ingresado al gimnasio.`);
    },
  };
};
