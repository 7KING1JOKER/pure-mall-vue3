import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import ElementPlus from "element-plus";
import 'element-plus/dist/index.css';
import './assets/base.css';

// 导入用户状态管理
import { useUserStore } from './store/user';

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(ElementPlus)

// 挂载应用
app.mount('#app')

// 初始化用户状态
const userStore = useUserStore();
userStore.initializeUser();

