// export const getToken = () => sessionStorage.getItem("token");

// export const getUser = () => {
//   const user = sessionStorage.getItem("user");
//   return user ? JSON.parse(user) : null;
// };

// export const isAuthenticated = () => !!getToken();

// export const logout = () => {
//   sessionStorage.clear();
// };

// utils/auth.js
export const getToken = () => sessionStorage.getItem("token");

export const getUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  sessionStorage.clear();
};
