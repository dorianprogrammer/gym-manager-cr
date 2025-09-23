import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";
import api from "./api";

export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    console.log('userCredential :>> ', userCredential);
    const user = userCredential.user;

    return {
      success: true,
      user: {
        ...user,
        displayName: user.displayName,
      },
      error: null,
    };
  } catch (error) {
    let errorMessage = "Error de inicio de sesión";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No existe una cuenta con este email";
        break;
      case "auth/wrong-password":
        errorMessage = "Contraseña incorrecta";
        break;
      case "auth/invalid-email":
        errorMessage = "Email inválido";
        break;
      case "auth/user-disabled":
        errorMessage = "Esta cuenta ha sido deshabilitada";
        break;
      case "auth/too-many-requests":
        errorMessage = "Demasiados intentos fallidos. Intenta más tarde";
        break;
      case "auth/network-request-failed":
        errorMessage = "Error de conexión. Verifica tu internet";
        break;
      default:
        errorMessage = error.message || "Error desconocido";
    }

    return { success: false, user: null, error: errorMessage };
  }
};

export const registerAdmin = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
      },
      error: null,
    };
  } catch (error) {
    let errorMessage = "Error al crear cuenta";

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "Ya existe una cuenta con este email";
        break;
      case "auth/invalid-email":
        errorMessage = "Email inválido";
        break;
      case "auth/weak-password":
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, user: null, error: errorMessage };
  }
};

export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    console.log("✅ Admin logged out successfully");
    return { success: true, error: null };
  } catch (error) {
    console.error("❌ Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Password reset function
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    let errorMessage = "Error al enviar email de recuperación";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No existe una cuenta con este email";
        break;
      case "auth/invalid-email":
        errorMessage = "Email inválido";
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

// Auth state listener
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {

      // console.log('user :>> ', user);
      const response = await api.get("users/profile", {
        headers: user?.accessToken ? { Authorization: `Bearer ${user?.accessToken}` } : {},
      });
      const userData = response.data;

      // console.log("userData :>> ", userData);

      callback({
        isAuthenticated: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
      });
    } else {
      callback({
        isAuthenticated: false,
        user: null,
      });
    }
  });
};

// Get current user
export const getCurrentUser = () => {
  const user = auth.currentUser;
  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }
  return null;
};
