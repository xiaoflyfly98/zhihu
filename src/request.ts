import axios from 'axios'
import store from './store'

export const instance = axios.create({
  baseURL: 'https://www.fastmock.site/mock/0ce2c57ec419350aa7a5e9b6cf304984/api',
  timeout: 1000
})

instance.interceptors.request.use(config => {
  store.commit('setLoading', true)
  store.commit('setErrorData', { status: false, message: '' })
  return config
})

instance.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  if (e) {
    const errorData = '登陆失败'
    store.commit('setErrorData', { status: true, message: errorData })
    store.commit('login', { isLogin: false })
    return Promise.reject(errorData)
  }
})
// instance.post('/api/currentPage=3&pageSize=3', {
//   currentPage: 3,
//   pageSize: 3
// }).then(data => console.log(data.data.page.list))
