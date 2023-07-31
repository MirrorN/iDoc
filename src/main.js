import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import './style.css'
import App from './App.vue'
import router from './router'
// 使用反馈组件
import 'element-plus/dist/index.css'

const app = createApp(App)
const store = createPinia()
store.use(piniaPluginPersist)
app.use(router)
app.use(store)
app.mount('#app')

