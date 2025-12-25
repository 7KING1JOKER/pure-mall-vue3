import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 按需引入Element Plus组件
import { ElButton, ElCard, ElInput, ElMessage, ElMessageBox, ElImage, ElCarousel, ElCarouselItem, ElDialog, ElForm, ElFormItem, ElCheckbox, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon, ElPagination, ElSelect, ElOption, ElDatePicker, ElNotification, ElAvatar, ElTag, ElMenu, ElMenuItem, ElDescriptions, ElDescriptionsItem, ElTable, ElTableColumn, ElRow, ElCol, ElEmpty, ElRadioGroup, ElRadio, ElButtonGroup, ElSteps, ElStep, ElInputNumber, ElBreadcrumb, ElBreadcrumbItem, ElResult, ElCollapseTransition, ElSubMenu, ElDrawer, ElLink } from 'element-plus'
import 'element-plus/dist/index.css'

import './assets/base.css';

const app = createApp(App)
const pinia = createPinia()

// 注册Element Plus组件
app.use(ElButton)
app.use(ElButtonGroup)
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
app.use(ElNotification)
app.use(ElAvatar)
app.use(ElTag)
app.use(ElMenu)
app.use(ElMenuItem)
app.use(ElSubMenu)
app.use(ElDescriptions)
app.use(ElDescriptionsItem)
app.use(ElTable)
app.use(ElTableColumn)
app.use(ElRow)
app.use(ElCol)
app.use(ElEmpty)
app.use(ElRadioGroup)
app.use(ElRadio)
app.use(ElSteps)
app.use(ElStep)
app.use(ElInputNumber)
app.use(ElBreadcrumb)
app.use(ElBreadcrumbItem)
app.use(ElResult)
app.use(ElCollapseTransition)
app.use(ElDrawer)
app.use(ElLink)

app.use(router)
app.use(pinia)
app.mount('#app')

