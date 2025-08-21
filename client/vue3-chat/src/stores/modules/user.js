import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 定义基础用户数据
  const userInfo = ref({})
  // 设置用户数据
  const setUserInfo = (obj) => {
    console.log(obj);
    
    userInfo.value = obj
  }
  return { userInfo, setUserInfo }
},{
  persist: true
})