import api from "@/lib/api";

export const getTotalStats = async (gymId, user) => {
  try {
    const response = await api.post(
      "/stats",
      { gymId: "W7QUHQqThDLI7pd5nlSE" },
      {
        headers: user?.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {},
      }
    );

    if (response.status !== 200) {
      return { success: false, error: "Failed to fetch stats" };
    }

    return { success: true, error: null, data: response.data };
  } catch (error) {
    console.log("error :>> ", error);
    return { success: false, error: error.message };
  }
};
