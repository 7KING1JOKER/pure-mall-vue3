import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 按需引入Element Plus组件
import { ElButton, ElCard, ElInput, ElMessage, ElMessageBox, ElImage, ElCarousel, ElCarouselItem, ElDialog, ElForm, ElFormItem, ElCheckbox, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon, ElPagination, ElSelect, ElOption, ElDatePicker } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/card/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/image/style/css'
import 'element-plus/es/components/carousel/style/css'
import 'element-plus/es/components/carousel-item/style/css'
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/form-item/style/css'
import 'element-plus/es/components/checkbox/style/css'
import 'element-plus/es/components/dropdown/style/css'
import 'element-plus/es/components/dropdown-menu/style/css'
import 'element-plus/es/components/dropdown-item/style/css'
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/pagination/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/date-picker/style/css'

import './assets/base.css';

const app = createApp(App)
const pinia = createPinia()

// 注册Element Plus组件
app.use(ElButton)
app.use(ElCard)
app.use(ElInput)
app.use(ElMessage)
app.use(ElMessageBox)
app.use(ElImage)
app.use(ElCarousel)
app.use(ElCarouselItem)
app.use(ElDialog)
app.use(ElForm)
app.use(ElFormItem)
app.use(ElCheckbox)
app.use(ElDropdown)
app.use(ElDropdownMenu)
app.use(ElDropdownItem)
app.use(ElIcon)
app.use(ElPagination)
app.use(ElSelect)
app.use(ElOption)
app.use(ElDatePicker)

app.use(router)
app.use(pinia)
app.mount('#app')

