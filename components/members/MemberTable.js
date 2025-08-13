// components/MemberTable.js
"use client";

import React from "react";
import { Mail, Phone, Calendar } from "lucide-react";

const membershipTypes = {
  daily: { label: "Pase Diario", price: "₡3,000" },
  weekly: { label: "Semanal", price: "₡15,000" },
  monthly: { label: "Mensual", price: "₡25,000" },
  quarterly: { label: "Trimestral", price: "₡65,000" },
  annual: { label: "Anual", price: "₡240,000" },
};

export default function MemberTable({ members, onMemberClick, loading }) {
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando miembros...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay miembros</h3>
        <p className="mt-1 text-sm text-gray-500">No se encontraron miembros con los criterios de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miembro</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Membresía
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Ingreso
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr
              key={member.id}
              onClick={() => onMemberClick(member)}
              className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 group"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <span className="text-white font-medium text-sm">{member.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-500">ID: {member.identification}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <div className="flex items-center mb-1">
                    <Mail className="h-3 w-3 text-gray-400 mr-2" />
                    <span className="truncate max-w-xs">{member.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 text-gray-400 mr-2" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">
                  {membershipTypes[member.membershipType]?.label || "Desconocido"}
                </div>
                <div className="text-sm text-gray-500 font-semibold">
                  {membershipTypes[member.membershipType]?.price || "₡0"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    member.isActive
                      ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                      : "bg-red-100 text-red-800 group-hover:bg-red-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${member.isActive ? "bg-green-400" : "bg-red-400"}`}
                  ></span>
                  {member.isActive ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{member.joinDate?.toDate?.()?.toLocaleDateString("es-CR") || "No disponible"}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Click instruction */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Haz clic en cualquier miembro para ver detalles y opciones
        </p>
      </div>
    </div>
  );
}
