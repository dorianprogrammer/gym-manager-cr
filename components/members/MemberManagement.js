"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import {
  addMember,
  updateMember,
  deleteMember,
  validateMemberForm,
  getInitialFormData,
  filterMembers,
} from "../../services/memberService";
import MemberFilters from "./MemberFilters";
import MemberTable from "./MemberTable";
import FormModal from "../ui/FormModal";
import MemberForm from "./MemberForm";
import ConfirmationModal from "../ui/ConfirmationModal";
import { useNotification } from "@/hooks/useNotification";
import MemberDetailCard from "./MemberDetailCard";
import BackButton from "../ui/BackButton";

export default function MemberManagement() {
  const notification = useNotification();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMemberCard, setShowMemberCard] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [formData, setFormData] = useState(getInitialFormData());
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);

    const { getMembers } = await import("../../services/memberService");
    const result = await getMembers();
    if (result.success) {
      setMembers(result.members);
    } else {
      console.log('hola');
      
      notification.error(`Error cargando miembros: ${result.error}`);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setFormErrors({});
  };

  const handleAddMember = async () => {
    const validation = validateMemberForm(formData);
    setFormErrors(validation.errors);

    if (!validation.isValid) return;

    setSaving(true);
    const result = await addMember(formData);

    if (result.success) {
      await loadMembers();
      setShowAddModal(false);
      resetForm();
      notification.memberAdded(formData.name);
    } else {
      notification.error(`Error al agregar miembro: ${result.error}`);
    }
    setSaving(false);
  };

  const handleEditMember = async () => {
    const validation = validateMemberForm(formData);
    setFormErrors(validation.errors);

    if (!validation.isValid) return;

    setSaving(true);
    const result = await updateMember(selectedMember.id, formData);

    if (result.success) {
      await loadMembers();
      setShowEditModal(false);
      setSelectedMember(null);
      resetForm();
      notification.memberUpdated(formData.name);
    } else {
      notification.error(`Error al actualizar miembro: ${result.error}`);
    }
    setSaving(false);
  };

  const handleDeleteMember = async () => {
    setSaving(true);
    const memberName = selectedMember.name;
    const result = await deleteMember(selectedMember.id);

    if (result.success) {
      await loadMembers();
      setShowDeleteModal(false);
      setSelectedMember(null);
      notification.memberDeleted(memberName);
    } else {
      notification.error(`Error al eliminar miembro: ${result.error}`);
    }
    setSaving(false);
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      membershipType: member.membershipType || "monthly",
      identification: member.identification || "",
      emergencyContact: member.emergencyContact || "",
      emergencyPhone: member.emergencyPhone || "",
      notes: member.notes || "",
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const openDeleteModal = (member) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowMemberCard(true);
  };

  const closeMemberCard = () => {
    setShowMemberCard(false);
  };

  const toggleMemberStatus = async (member) => {
    const result = await updateMember(member.id, { isActive: !member.isActive });
    if (result.success) {
      await loadMembers();
      notification.memberStatusChanged(member.name, !member.isActive);
    } else {
      notification.error(`Error al cambiar estado: ${result.error}`);
    }
  };

  // Filter members based on current search and filter criteria
  const filteredMembers = filterMembers(members, searchTerm, filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <BackButton fallbackHref="/dashboard" />
            <div>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Gestión de Miembros
              </h2>
              <p className="mt-1 text-sm text-gray-500">Administra todos los miembros de tu gimnasio</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Agregar Miembro
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <MemberFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        members={members}
        filteredMembers={filteredMembers}
      />

      {/* Members Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <MemberTable members={filteredMembers} onMemberClick={handleMemberClick} loading={loading} />
      </div>

      {/* Member Detail Card - Shows when clicking a row */}
      <MemberDetailCard
        member={selectedMember}
        isOpen={showMemberCard}
        onClose={closeMemberCard}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onToggleStatus={toggleMemberStatus}
      />

      {/* Add Member Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        onSubmit={handleAddMember}
        title="Agregar Nuevo Miembro"
        submitText="Crear Miembro"
        loading={saving}
        size="lg"
      >
        <MemberForm formData={formData} setFormData={setFormData} formErrors={formErrors} />
      </FormModal>

      {/* Edit Member Modal */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMember(null);
          resetForm();
        }}
        onSubmit={handleEditMember}
        title="Editar Miembro"
        submitText="Actualizar Miembro"
        loading={saving}
        size="lg"
      >
        <MemberForm formData={formData} setFormData={setFormData} formErrors={formErrors} />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMember(null);
        }}
        onConfirm={handleDeleteMember}
        title="Eliminar Miembro"
        message={`¿Estás seguro que quieres eliminar a ${selectedMember?.name}? Esta acción no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        confirmColor="red"
        loading={saving}
        icon={<Trash2 className="h-6 w-6" />}
      />
    </div>
  );
}
