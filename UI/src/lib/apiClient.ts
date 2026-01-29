"use client"

import axios from "axios"
import Cookies from "js-cookie"

export function getTokenFromCookie() {
  return Cookies.get("access_token") ?? null
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000",
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = getTokenFromCookie()
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config
})

export default apiClient
