import Axios from 'axios'

export const get = async (route: string) => {
  const config = {
    headers: { Authorization: `Bearer ${'token'}` },
  }

  try {
    const response = await Axios.get(route, config)
    let responseData = response.data

    if (responseData === null) {
      responseData = []
    }

    if (responseData instanceof Object) {
      return responseData
    } else {
      responseData = []
    }
    return responseData
  } catch (error) {
    if (Axios.isCancel(error)) {
      // console.log('Request canceled: ', error.message);
      return
    }
    return Promise.reject({
      status: error.response?.status,
      what: error.response?.statusText,
    })
  }
}

export const post = async (route: string, data = {}) => {
  try {
    const response = await Axios.post(route, data)
    let responseData = response.data

    if (responseData === null) {
      responseData = []
    }

    if (responseData instanceof Object) {
      return responseData
    } else {
      responseData = []
    }
    return responseData
  } catch (error) {
    if (Axios.isCancel(error)) {
      // console.log('Request canceled: ', error.message);
      return
    }
    return Promise.reject({
      status: error.response?.status,
      what: error.response?.statusText,
    })
  }
}
