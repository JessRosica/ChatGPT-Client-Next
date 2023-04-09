import 'virtual:windi.css'
import './style/index.less'

// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
// document.body.setAttribute('arco-theme', 'dark')

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ArcoVueIcon)

app.mount('#app')
