"use client";

import React from "react";

const membershipTypes = {
  daily: { label: "Pase Diario", price: "₡3,000" },
  weekly: { label: "Semanal", price: "₡15,000" },
  monthly: { label: "Mensual", price: "₡25,000" },
  quarterly: { label: "Trimestral", price: "₡65,000" },
  annual: { label: "Anual", price: "₡240,000" },
};

export default function MemberForm({ formData, setFormData, formErrors }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`text-gray-500 block w-full rounded-md border px-3 py-2 ${
            formErrors.name ? "border-red-300" : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Ej: Juan Pérez Rodríguez"
        />
        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          type="text"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`block w-full rounded-md border px-3 py-2 text-gray-500 ${
            formErrors.email ? "border-red-300" : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="juan@email.com"
        />
        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className={`text-gray-500 block w-full rounded-md border px-3 py-2 ${
            formErrors.phone ? "border-red-300" : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="8888-8888"
        />
        {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
      </div>

      {/* Identification */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label>
        <input
          type="text"
          value={formData.identification}
          onChange={(e) => handleChange("identification", e.target.value)}
          className={`block w-full rounded-md border px-3 py-2 ${
            formErrors.identification ? "border-red-300" : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="1-2345-6789"
        />
        {formErrors.identification && <p className="text-red-500 text-xs mt-1">{formErrors.identification}</p>}
      </div>

      {/* Membership Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Membresía</label>
        <select
          value={formData.membershipType}
          onChange={(e) => handleChange("membershipType", e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.entries(membershipTypes).map(([key, type]) => (
            <option key={key} value={key}>
              {type.label} - {type.price}
            </option>
          ))}
        </select>
      </div>

      {/* Emergency Contact */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contacto de Emergencia</label>
        <input
          type="text"
          value={formData.emergencyContact}
          onChange={(e) => handleChange("emergencyContact", e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nombre del contacto"
        />
      </div>

      {/* Emergency Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Emergencia</label>
        <input
          type="tel"
          value={formData.emergencyPhone}
          onChange={(e) => handleChange("emergencyPhone", e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="8888-8888"
        />
      </div>

      {/* Notes */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={3}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Información adicional, condiciones médicas, etc."
        />
      </div>
    </div>
  );
}
