<template>
  <div class="payment-container">
    <!-- 响应式菜单栏 -->
    <PcMenu />
    <!-- 购物车步骤条 -->
    <CardSteps />

    <!-- 付款内容区域 -->
    <div class="payment-content">
      <!-- 订单信息 -->
      <div class="order-info-section">
        <div class="section-title">
          <el-icon><Document /></el-icon> 订单信息
        </div>
        <div class="order-info">
          <div class="info-item">
            <span class="label">订单编号：</span>
            <span class="value">{{ orderNumber }}</span>
            <el-button type="text" size="small" @click="copyOrderNumber">
              <el-icon><CopyDocument /></el-icon> 复制
            </el-button>
          </div>
          <div class="info-item">
            <span class="label">创建时间：</span>
            <span class="value">{{ orderTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">支付金额：</span>
            <span class="value amount">¥{{ orderAmount.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <span class="label">支付方式：</span>
            <span class="value">{{ getPaymentMethodName(paymentMethod) }}</span>
          </div>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="payment-method-section">
        <div class="section-title">
          <el-icon><CreditCard /></el-icon> 选择支付方式
        </div>
        <div class="payment-methods">
          <el-radio-group v-model="paymentMethod">
            <div class="payment-method-item">
              <el-radio label="alipay">
                <div class="method-content">
                  <img src="https://img.icons8.com/color/48/000000/alipay.png" alt="支付宝" class="method-icon" />
                  <div class="method-info">
                    <div class="method-name">支付宝</div>
                    <div class="method-desc">推荐使用支付宝快捷支付</div>
                  </div>
                </div>
              </el-radio>
            </div>
            <div class="payment-method-item">
              <el-radio label="wechat">
                <div class="method-content">
                  <img src="https://img.icons8.com/color/48/000000/weixing.png" alt="微信支付" class="method-icon" />
                  <div class="method-info">
                    <div class="method-name">微信支付</div>
                    <div class="method-desc">使用微信扫码支付</div>
                  </div>
                </div>
              </el-radio>
            </div>
            <div class="payment-method-item">
              <el-radio label="creditcard">
                <div class="method-content">
                  <img src="https://img.icons8.com/color/48/000000/bank-card-front-side.png" alt="信用卡" class="method-icon" />
                  <div class="method-info">
                    <div class="method-name">信用卡支付</div>
                    <div class="method-desc">支持Visa、Mastercard等</div>
                  </div>
                </div>
              </el-radio>
            </div>
          </el-radio-group>
        </div>
      </div>

      <!-- 支付宝支付 -->
      <div v-if="paymentMethod === 'alipay'" class="payment-qrcode-section">
        <div class="qrcode-container">
          <div class="qrcode-title">请使用支付宝扫码支付</div>
          <div class="qrcode-image">
            <el-image src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/pay" />
          </div>
          <div class="qrcode-tips">
            <p>请在 <span class="countdown">{{ countdown }}</span> 内完成支付</p>
            <p>付款后请勿关闭页面，等待系统自动跳转</p>
          </div>
        </div>
      </div>

      <!-- 微信支付 -->
      <div v-if="paymentMethod === 'wechat'" class="payment-qrcode-section">
        <div class="qrcode-container">
          <div class="qrcode-title">请使用微信扫码支付</div>
          <div class="qrcode-image">
            <el-image src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/pay" />
          </div>
          <div class="qrcode-tips">
            <p>请在 <span class="countdown">{{ countdown }}</span> 内完成支付</p>
            <p>付款后请勿关闭页面，等待系统自动跳转</p>
          </div>
        </div>
      </div>

      <!-- 信用卡支付 -->
      <div v-if="paymentMethod === 'creditcard'" class="credit-card-section">
        <div class="card-form">
          <el-form :model="cardForm" label-width="100px">
            <el-form-item label="卡号">
              <el-input v-model="cardForm.number" placeholder="请输入信用卡号" maxlength="19" />
            </el-form-item>
            <el-form-item label="持卡人">
              <el-input v-model="cardForm.name" placeholder="请输入持卡人姓名" />
            </el-form-item>
            <el-form-item label="有效期">
              <div class="expiry-inputs">
                <el-select v-model="cardForm.expiryMonth" placeholder="月">
                  <el-option v-for="m in 12" :key="m" :label="m.toString().padStart(2, '0')" :value="m.toString().padStart(2, '0')" />
                </el-select>
                <span class="separator">/</span>
                <el-select v-model="cardForm.expiryYear" placeholder="年">
                  <el-option v-for="y in 10" :key="y" :label="(new Date().getFullYear() + y - 1).toString().slice(-2)" :value="(new Date().getFullYear() + y - 1).toString().slice(-2)" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="安全码">
              <el-input v-model="cardForm.cvv" placeholder="CVV" maxlength="3" />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="payment-footer">
        <el-button @click="goBack">返回订单确认</el-button>
        <el-button type="primary" @click="completePayment">确认支付</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { useOrderStore } from '../store/order'
import { useCartStore } from '../store/cart'
import { storeToRefs } from 'pinia'
import PcMenu from '../layouts/PcMenu.vue'
import CardSteps from '../layouts/CardSteps.vue';
import { CreditCard, CopyDocument, Document } from '@element-plus/icons-vue'

const router = useRouter()

// 使用stores
const orderStore = useOrderStore()
const cartStore = useCartStore()

// 从store解构获取非响应式方法
const { 
  completePayment: storeCompletePayment,
  getPaymentMethodName,
  startCountdown
} = orderStore

const {
  setActiveStep
} = cartStore
// 购物车步骤条设置为第3步
setActiveStep(2)

// 从store中解构响应式数据
const { 
  paymentMethod,
  cardForm,
  countdown,
  currentOrder
} = storeToRefs(orderStore)

// 倒计时清理函数引用
const countdownCleanup = ref<(() => void) | null>(null)

// 订单信息 - 从当前订单中获取计算属性
const orderNumber = computed(() => currentOrder.value?.orderNumber || '')
const orderTime = computed(() => currentOrder.value?.orderTime || '')
const orderAmount = computed(() => currentOrder.value?.orderAmount || 0)

// 复制订单号
const copyOrderNumber = () => {
  navigator.clipboard.writeText(orderNumber.value)
    .then(() => {
      ElMessage.success('订单号已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}

// 返回订单确认页面
const goBack = () => {
  router.push('/checkout')
}

// 确认支付
const completePayment = () => {
  // 这里可以添加支付验证逻辑
  if (paymentMethod.value === 'creditcard') {
    // 验证信用卡信息
    if (!cardForm.value.number || !cardForm.value.name || !cardForm.value.expiryMonth || !cardForm.value.expiryYear || !cardForm.value.cvv) {
      ElMessage.error('请填写完整的信用卡信息')
      return
    }
  }

  // 模拟支付处理
  ElNotification({
    title: '支付处理中',
    message: '正在处理您的支付请求，请稍候...',
    type: 'info',
    duration: 2000
  })

  // 调用store中的支付方法
  storeCompletePayment()

  // 模拟支付成功，实际项目中这里会调用支付API
  setTimeout(() => {
    router.push('/order-complete')
  }, 2000)
}

// 页面加载时启动倒计时
onMounted(() => {
  console.log('支付页面已加载')
  // 启动倒计时，传入超时回调
  countdownCleanup.value = startCountdown(() => {
    ElMessage.warning('支付超时，请重新下单')
    router.push('/cart')
  })
  
  // 如果当前订单为空，创建一个默认订单
  if (!currentOrder.value) {
    orderStore.createOrder()
  }
})

// 页面卸载前清除倒计时
onBeforeUnmount(() => {
  if (countdownCleanup.value) {
    countdownCleanup.value()
  }
})
</script>

<style scoped>
.payment-container {
  padding: 20px;
  gap: 20px;
  margin-top: 60px;
  height: calc(100vh - 60px);
  width: 100%;
  display: flex;
}


/* 内容区域通用样式 */
.payment-content {
  width: 90%;
  border-radius: 5px;
  border: 1px solid #fff;
  background-color: var(--light-card-bg);
  backdrop-filter: blur(2px);
  overflow-y: auto;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.order-info-section,
.payment-method-section,
.payment-qrcode-section,
.credit-card-section {
  background: var(--light-card-bg);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* 订单信息 */
.order-info {
  padding: 15px;
  background: var(--light-card-bg);
  border-radius: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  width: 100px;
  color: #666;
}

.value {
  flex: 1;
  font-weight: 500;
}

.value.amount {
  color: #e53935;
  font-size: 20px;
  font-weight: 600;
}

/* 支付方式 */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-method-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s;
}

.payment-method-item:hover {
  border-color: #409eff;
}

.method-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.method-icon {
  width: 40px;
  height: 40px;
}

.method-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.method-desc {
  font-size: 13px;
  color: #666;
}

/* 二维码支付 */
.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.qrcode-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
}

.qrcode-image {
  margin-bottom: 20px;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
}

.qrcode-tips {
  text-align: center;
  color: #666;
  line-height: 1.6;
}

.countdown {
  color: #e53935;
  font-weight: 600;
  font-size: 16px;
}

/* 信用卡表单 */
.card-form {
  max-width: 500px;
  margin: 0 auto;
}

.expiry-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.separator {
  font-size: 18px;
  color: #666;
}

/* 底部操作栏 */
.payment-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .payment-container {
    padding: 15px;
    margin-top: 52px;
    height: calc(100vh - 52px);
  }
  
  .info-item {
    flex-wrap: wrap;
  }
  
  .label {
    width: 100%;
    margin-bottom: 5px;
  }
  
  .method-content {
    flex-direction: column;
    align-items: flex-start;
    padding-left: 30px;
  }
  
  .method-icon {
    margin-bottom: 10px;
  }
}
</style>