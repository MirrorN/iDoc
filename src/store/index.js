/* 全局状态管理 */
import { defineStore } from "pinia"

export const useStore = defineStore('storage', {
  state: () => {
    return {
      pathsMap: { '64bde8309960cdc874610281': '主目录' }
    }
  },
  actions: {
    updatePathsMap(key, value) {
      this.pathsMap[key] = value
    }
  },
  persist: {
    enabled: true,
    strategies: {
      /* 默认使用 store 的id作为 key */
      // key: 'storage',
      /* 默认默认存储在 session storage 中 */
      // storage: localStorage,
      /* 默认情况下所有的 state 都会缓存 使用 paths 指定持久化的字段 */
      paths: ['pathsMap']
    }
  }
})