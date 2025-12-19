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
        <div class="order-section-content">
          <el-descriptions :column="2" :border="true">
            <el-descriptions-item label="订单编号" label-class-name="order-label" content-class-name="order-content">{{ orderNumber }}</el-descriptions-item>
            <el-descriptions-item label="创建时间" label-class-name="order-label" content-class-name="order-content">{{ orderTime }}</el-descriptions-item>
            <el-descriptions-item label="支付金额" label-class-name="order-label" content-class-name="order-content">¥{{ orderAmount.toFixed(2) }}</el-descriptions-item>
            <el-descriptions-item label="支付方式" label-class-name="order-label" content-class-name="order-content">{{ getPaymentMethodName(paymentMethod) }}</el-descriptions-item>
          </el-descriptions>
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
          <div class="payment-footer">
            <el-icon @click="completePayment" class="footer-icon"> <ArrowRightBold /> </el-icon>
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
          <div class="payment-footer">
            <el-icon @click="completePayment" class="footer-icon"> <ArrowRightBold /> </el-icon>
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
                <el-select v-model="cardForm.expiryMonth" placeholder="月" style="min-width: 80px;">
                  <el-option v-for="m in 12" :key="m" :label="m.toString().padStart(2, '0')" :value="m.toString().padStart(2, '0')" />
                </el-select>
                <span class="separator">/</span>
                <el-select v-model="cardForm.expiryYear" placeholder="年" style="min-width: 80px;">
                  <el-option v-for="y in 10" :key="y" :label="(new Date().getFullYear() + y - 1).toString().slice(-2)" :value="(new Date().getFullYear() + y - 1).toString().slice(-2)" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="安全码">
              <el-input v-model="cardForm.cvv" placeholder="CVV" maxlength="3" />
            </el-form-item>
          </el-form>
          <div class="payment-footer">
            <el-icon @click="completePayment" class="footer-icon"> <ArrowRightBold /> </el-icon>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useOrderStore } from '../store/order'
import { useCartStore } from '../store/cart'
import { storeToRefs } from 'pinia'
import PcMenu from '../layouts/PcMenu.vue'
import CardSteps from '../layouts/CardSteps.vue';
import { CreditCard, Document, ArrowRightBold } from '@element-plus/icons-vue'

// 使用stores
const orderStore = useOrderStore()
const cartStore = useCartStore()

// 从store解构获取非响应式方法
const { 
  completePayment,
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
  orderNumber,
  orderTime,
  orderAmount
} = storeToRefs(orderStore)

// 确保cardForm有初始值
if (!cardForm.value.expiryMonth) {
  cardForm.value.expiryMonth = ''
}
if (!cardForm.value.expiryYear) {
  cardForm.value.expiryYear = ''
}

// 页面加载时启动倒计时
onMounted(() => {
  console.log('支付页面已加载')
  // 启动倒计时，传入超时回调
  startCountdown(() => {
    import('element-plus').then(({ ElMessage }) => {
      import('vue-router').then(({ useRouter }) => {
        const router = useRouter()
        ElMessage.warning('支付超时，请重新下单')
        router.push('/cart')
      })
    })
  })
  
})

// 页面卸载前清除倒计时
onBeforeUnmount(() => {
  if (orderStore.countdownCleanup) {
    orderStore.countdownCleanup()
    orderStore.countdownCleanup = null
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
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-info-section,
.payment-method-section {
  background: var(--light-card-bg);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.payment-qrcode-section,
.credit-card-section {
  background: var(--light-card-bg);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-height: 0;
  width: 100%;
}

.credit-card-section,
.payment-qrcode-section {
  margin-bottom: 0;
  /* background-color: transparent; */
  box-shadow: none;
}

/* 订单信息 */
.order-section-content :deep(.el-descriptions .el-descriptions__body),
.order-section-content :deep(.order-label),
.order-section-content :deep(.order-content) {
  background: transparent !important;
}

.order-section-content :deep(.order-label) {
  color: #000000ce;
  font-size: 14px;
  font-weight: 500;
}

/* .order-section-content :deep(.order-content) {
  color: #fff;
  font-size: 14px;
  font-weight: 10;
} */

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
  padding: 10px;
  transition: all 0.3s;
}

.payment-method-item:hover {
  border-color: #000;
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
  color: #000;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.method-desc {
  font-size: 12px;
  color: #000;
  font-weight: 320;
}

/* 二维码支付 */
.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: 100%;
  position: relative;
}

.qrcode-title {
  font-size: 16px;
  font-weight: 400;
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
  line-height: 1.6;
}

.qrcode-tips p {
  font-size: 16px;
  font-weight: 320;
}

.countdown {
  font-weight: 500;
  font-size: 18px;
}

/* 信用卡表单 */
.card-form {
  max-width: 500px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
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
  gap: 10px;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 0;
  right: 0;
  width: fit-content;
}

.footer-icon{
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.footer-icon:hover {
  transform: translateY(-10px);
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