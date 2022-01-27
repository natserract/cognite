
const authProvider = {
  login: (payloads) => {
    // invoke -> getProfile if null
    // invoke -> loginCognito
    console.log('payloads', payloads)

    return Promise.resolve()
  },
  logout: () => Promise.resolve(),
  checkAuth: () => Promise.resolve(),
  checkError: () => Promise.resolve(),
  getPermissions: () => Promise.resolve(),
  getUserIdentity: () => Promise.resolve(),
}

export default authProvider;
