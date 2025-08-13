import React from "react";
import { X, Edit, Trash2, UserCheck, UserX, Mail, Phone, Calendar, CreditCard, AlertCircle } from "lucide-react";

const membershipTypes = {
  daily: { label: "Pase Diario", price: "₡3,000" },
  weekly: { label: "Semanal", price: "₡15,000" },
  monthly: { label: "Mensual", price: "₡25,000" },
  quarterly: { label: "Trimestral", price: "₡65,000" },
  annual: { label: "Anual", price: "₡240,000" },
};

export default function MemberDetailCard({ member, isOpen, onClose, onEdit, onDelete, onToggleStatus }) {
  if (!isOpen || !member) return null;

  const membershipInfo = membershipTypes[member.membershipType] || { label: "Desconocido", price: "₡0" };

  const handleAction = (action) => {
    switch (action) {
      case "edit":
        onEdit(member);
        break;
      case "delete":
        onDelete(member);
        break;
      case "toggle":
        onToggleStatus(member);
        break;
    }

    onClose();
  };

  const truncateName = (name, maxLength = 25) => {
    if (!name) return "";
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-opacity-25 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Member Card */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md transform transition-all duration-200 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>

            {/* Member Avatar & Name */}
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">{member.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate"> {truncateName(member.name, 20)}</h2>
                <p className="text-sm text-gray-500">ID: {member.identification}</p>
                <div className="flex items-center mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      member.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.isActive ? (
                      <>
                        <UserCheck className="h-3 w-3 mr-1" />
                        Activo
                      </>
                    ) : (
                      <>
                        <UserX className="h-3 w-3 mr-1" />
                        Inactivo
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Member Details */}
          <div className="px-6 py-4 space-y-4">
            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-sm">{member.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-sm">{member.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-sm">
                  Miembro desde {member.joinDate?.toDate?.()?.toLocaleDateString("es-CR") || "Fecha no disponible"}
                </span>
              </div>
            </div>

            {/* Membership Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Membresía</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{membershipInfo.price}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{membershipInfo.label}</p>
            </div>

            {/* Emergency Contact (if available) */}
            {member.emergencyContact && (
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                  <span className="text-sm font-medium text-amber-800">Contacto de Emergencia</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">{member.emergencyContact}</p>
                {member.emergencyPhone && <p className="text-sm text-amber-600">{member.emergencyPhone}</p>}
              </div>
            )}

            {/* Notes (if available) */}
            {member.notes && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-700">
                  <strong>Notas:</strong> {member.notes}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-3">
              {/* Edit Button */}
              <button
                onClick={() => handleAction("edit")}
                className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <Edit className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Editar</span>
              </button>

              {/* Toggle Status Button */}
              <button
                onClick={() => handleAction("toggle")}
                className={`flex items-center justify-center px-4 py-3 rounded-xl transition-colors group ${
                  member.isActive
                    ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                {member.isActive ? (
                  <>
                    <UserX className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Pausar</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Activar</span>
                  </>
                )}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleAction("delete")}
                className="flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors group"
              >
                <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Eliminar</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="px-6 py-3 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Check-ins totales: {member.totalCheckIns || 0}</span>
              <span>Último check-in: {member.lastCheckIn?.toDate?.()?.toLocaleDateString("es-CR") || "Nunca"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
