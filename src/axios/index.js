import axios from "axios"

const http = axios.create({
  timeout: 5000,
})
http.defaults.baseURL = 'http://127.0.0.1:3000'

// 请求拦截
http.interceptors.request.use(config => {
  // 这里是发起请求之前 可以设置 token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 响应拦截 
http.interceptors.response.use(response => {
  //这个response 就是返回结果 可以在这里判断返回体中的状态码 来进行不同的处理
  return response
})



export default http