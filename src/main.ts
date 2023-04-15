/**
 // TODO 
 1. 请求地址放到配置文件
 */
import 'virtual:windi.css'
import './style/index.less'

// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import { createApp } from 'vue'

import App from './App.vue'
import { setupDirectives } from './directives/index'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ArcoVueIcon)

setupDirectives(app)
app.mount('#app')
