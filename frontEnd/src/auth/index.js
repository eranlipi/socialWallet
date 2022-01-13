import crypto from "../helpers/cryptography";

export const login = (userData) => {
  const data = {
    isAuthenticated: true,
    user: userData,
  };
  const encryptedText = crypto.encrypt(JSON.stringify(data));

  localStorage.setItem("_UAD_", encryptedText);
};

export const logout = () => {
  localStorage.removeItem("_UAD_");
};

export const getUser = () => {
  try {
    const encryptedText = localStorage.getItem("_UAD_");
    const decryptedText = crypto.decrypt(encryptedText);
    const data = JSON.parse(decryptedText);
    if (data.isAuthenticated && data.user) {
      return data;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};
