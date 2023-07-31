import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 配置 element-plus 自动导入的插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // resolve: {
  //   alias: {
  //     // 配置使用 @ 代替 src 路径
  //     '@': fileURLToPath(new URL('./src', import.meta.url))
  //   }
  // }
})