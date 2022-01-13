import axios from "axios";

/**
 * Set API URL
 */
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.baseURL = BASE_URL;

const ajaxHandler = async (axiosCall) => {
  try {
    const response = await axiosCall;
    return Promise.resolve(response.data);
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("_UAD_");
        window.location = "/signin";
      }
      return Promise.resolve(error.response.data);
    } else {
      return Promise.resolve({
        type: "error",
        msg: "Network connection error",
      });
    }
  }
};

const api = {
  auth: {
    register: (data) =>
      ajaxHandler(
        axios.post("/api/auth/sign-up", data, { withCredentials: true })
      ),
    login: (data) =>
      ajaxHandler(
        axios.post("/api/auth/sign-in", data, { withCredentials: true })
      ),
    thirdParty: (data) =>
      ajaxHandler(
        axios.get(`/api/auth/third-party/verify?token=${data}`, {
          withCredentials: true,
        })
      ),
    logout: () =>
      ajaxHandler(axios.get("/api/auth/sign-out", { withCredentials: true })),
    editProfile: (data) =>
      ajaxHandler(
        axios.post("/api/auth/update-profile", data, { withCredentials: true })
      ),
    getProfile: () =>
      ajaxHandler(
        axios.get("/api/auth/profile", { withCredentials: true })),
    uploadProfilePicture: (data) =>
      ajaxHandler(
        axios.post("/api/auth/upload-profile-picture", data, { withCredentials: true })),
    loadProfileImage: (param) => {
      const url = `${BASE_URL}/api/auth/load-profile-image?userID=${param}`;
      console.log(url);
      return url;
    },
  },
  user: {},
  connection: {
    getConnections: () =>
      ajaxHandler(
        axios.get("/api/connection/connections", { withCredentials: true })
      ),
    getDisconnectedUsers: () =>
      ajaxHandler(
        axios.get("/api/connection/disconnected-users", {
          withCredentials: true,
        })
      ),
    addConnection: (data) =>
      ajaxHandler(
        axios.post(
          "/api/connection/add-connection",
          { connectedUserID: data },
          { withCredentials: true }
        )
      ),
    removeConnection: (data) =>
      ajaxHandler(
        axios.post(
          "/api/connection/remove-connection",
          { connectedUserID: data },
          { withCredentials: true }
        )
      ),
  },
};

const urls = {
  auth: {
    google: `${BASE_URL}/api/auth/third-party/google`,
    loadProfileImage: (param) => {
      const url = `${BASE_URL}/api/auth/load-profile-image?userID=${param}`;
      return url;
    },
  },
};

export default api;
export { urls };
