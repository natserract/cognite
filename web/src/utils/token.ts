export const removeToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};
