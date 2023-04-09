import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.')
  return {
    base: '/ChatGPT-Client-Next',
    plugins: [
      vue(),
      vueJsx(),
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
      WindiCSS(),
      AutoImport({
        vueTemplate: true,
        imports: ['vue', 'vue-router'],
        dirs: ['src/config'],
        dts: 'typings/auto-imports.d.ts',
        // dts: false,
        resolvers: [ArcoResolver()],
        eslintrc: {
          enabled: true,
          filepath: '.eslintrc-auto-import.json',
          globalsPropValue: true
        }
      }),
      Components({
        dirs: [],
        dts: 'typings/components.d.ts',
        resolvers: [ArcoResolver({ importStyle: 'less' })]
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'scrollbar-track-size': '6px',
            'scrollbar-thumb-bar-size': '6px',
            'arcoblue-1': ' #E8FFF5',
            'arcoblue-2': '#B1EDD6',
            'arcoblue-3': '#80DABB',
            'arcoblue-4': '#54C8A3',
            'arcoblue-5': '#2FB58F',
            'arcoblue-6': '#10A37F',
            'arcoblue-7': '#0A8D71',
            'arcoblue-8': '#067863',
            'arcoblue-9': '#026254',
            'arcoblue-10': '#004D44'
            // 'arcoblue-1': ' #E8FFFC',
            // 'arcoblue-2': '#AFF0EB',
            // 'arcoblue-3': '#7BE1DC',
            // 'arcoblue-4': '#4DD3D0',
            // 'arcoblue-5': '#24C1C4',
            // 'arcoblue-6': '#00ADB5',
            // 'arcoblue-7': '#008E9B',
            // 'arcoblue-8': '#007281',
            // 'arcoblue-9': '#005767',
            // 'arcoblue-10': '#003E4D'
          }
        }
      }
    },
    server: {
      port: Number(env.VITE_PORT),
      host: true,
      open: true
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
