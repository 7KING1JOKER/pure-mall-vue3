<template>
    <div class="footer-content">
        <div class="footer-logo">
        <el-image 
            src="https://vuejs.org/images/logo.png" 
            fit="contain" 
            style="width: 80px; height: 80px;"
        />
        <h3>Pure Mall</h3>
        </div>
        <div class="footer-links">
        <div class="link-group">
            <h4>购物指南</h4>
            <a href="#">购物流程</a>
            <a href="#">会员介绍</a>
            <a href="#">常见问题</a>
        </div>
        <div class="link-group">
            <h4>配送方式</h4>
            <a href="#">上门自提</a>
            <a href="#">配送服务</a>
            <a href="#">运费说明</a>
        </div>
        <div class="link-group">
            <h4>售后服务</h4>
            <a href="#">退款说明</a>
            <a href="#">保修政策</a>
            <a href="#">取消订单</a>
        </div>
        </div>
        <div class="footer-copyright">
        <p>© 2023 Pure Mall. All rights reserved.</p>
        </div>
    </div>
</template>

<script lang="ts" setup >

</script>

<style scoped>
.footer-content {
  max-width: 1200px;
  width: 100%;
  padding: 40px 20px;
}

.footer-logo {
  text-align: center;
  margin-bottom: 40px;
}

.footer-logo h3 {
  margin-top: 15px;
  font-size: 1.8rem;
  font-weight: 300;
}

.footer-links {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.link-group {
  min-width: 200px;
  margin-bottom: 30px;
}

.link-group h4 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 400;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
}

.link-group a {
  display: block;
  color: #bdc3c7;
  margin-bottom: 10px;
  text-decoration: none;
  transition: color 0.3s;
}

.link-group a:hover {
  color: white;
}

.footer-copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>