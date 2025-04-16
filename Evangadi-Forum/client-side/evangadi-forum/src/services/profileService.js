import axios from "axios";

const API_URL = "https://server-side-r4vi.onrender.com/api/users";

const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

const updateProfile = async (profileData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/profile`, profileData, config);
  return response.data;
};

const changePassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    // Ensure all required fields are included
    const requestData = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword || passwordData.newPassword, // Fallback if confirmPassword not provided
    };

    const response = await axios.put(
      `${API_URL}/change-password`,
      requestData,
      config
    );
    return response.data;
  } catch (error) {
    // Log detailed error for debugging
    console.error("Error in changePassword:", {
      errorResponse: error.response?.data,
      status: error.response?.status,
      requestData: passwordData,
    });

    // Throw a more descriptive error
    throw new Error(
      error.response?.data?.msg ||
        "Failed to change password. Please try again."
    );
  }
};

const profileService = {
  getProfile,
  updateProfile,
  changePassword,
};

export default profileService;
