import {
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// Add a new member
export const addMember = async (memberData) => {
  try {
    const docRef = await addDoc(collection(db, "members"), {
      ...memberData,
      joinDate: serverTimestamp(),
      isActive: true,
      lastCheckIn: null,
      totalCheckIns: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id, error: null };
  } catch (error) {
    console.error("Error adding member:", error);
    return { success: false, id: null, error: error.message };
  }
};

// Get all members
export const getMembers = async () => {
  try {
    // console.log('hola getMembers');
    
    // const q = query(collection(db, "members"), orderBy("joinDate", "desc"));
    // const querySnapshot = await getDocs(q);
    // const members = [];
    
    // querySnapshot.forEach((doc) => {
    //   members.push({ id: doc.id, ...doc.data() });
    // });

    return { success: true, members: [], error: null };
  } catch (error) {
    console.log("Error fetching members:", error);
    return { success: false, members: [], error: error.message };
  }
};

// Update a member
export const updateMember = async (memberId, updates) => {
  try {
    await updateDoc(doc(db, "members", memberId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating member:", error);
    return { success: false, error: error.message };
  }
};

// Delete a member
export const deleteMember = async (memberId) => {
  try {
    await deleteDoc(doc(db, "members", memberId));
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting member:", error);
    return { success: false, error: error.message };
  }
};

// Validate member form data
export const validateMemberForm = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = "Nombre es requerido";
  }

  if (!formData.email?.trim()) {
    errors.email = "Email es requerido";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email inválido";
  }

  if (!formData.phone?.trim()) {
    errors.phone = "Teléfono es requerido";
  }

  if (!formData.identification?.trim()) {
    errors.identification = "Identificación es requerida";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Initial form data structure
export const getInitialFormData = () => ({
  name: "",
  email: "",
  phone: "",
  membershipType: "monthly",
  identification: "",
  emergencyContact: "",
  emergencyPhone: "",
  notes: "",
});

// Member search and filter logic
export const filterMembers = (members, searchTerm, filterStatus) => {
  return members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm) ||
      member.identification?.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && member.isActive) ||
      (filterStatus === "inactive" && !member.isActive);

    return matchesSearch && matchesStatus;
  });
};
