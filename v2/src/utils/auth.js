export const getToken = () => sessionStorage.getItem("token");

export const getUser = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  sessionStorage.clear();
};
