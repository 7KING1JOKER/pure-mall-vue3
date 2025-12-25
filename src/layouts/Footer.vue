<template>
  <section class="section-footer scroll-section">
    <div class="footer-content">
        <div class="footer-logo">
        <h1>Pure Mall</h1>
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
  </section>
</template>

<script lang="ts" setup >

</script>

<style scoped>
.section-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 25px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #000000c9;
  color: white;
}

.footer-content {
  height: 100%;
  width: 100%;
  padding: 30px 20px;
}

.footer-logo {
  text-align: center;
  margin-bottom: 80px;
}

.footer-logo h1 {
  font-size: 2rem;
  font-family: fantasy;
  font-weight: lighter;
  letter-spacing: 1px;
}

.footer-links {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 40px;
  gap: 30px;
}

.link-group {
  min-width: 180px;
  margin-bottom: 30px;
  padding: 0 15px;
}

.link-group h4 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 12px;
  letter-spacing: 0.5px;
}

.link-group a {
  display: block;
  color: #bdc3c7;
  margin-bottom: 15px;
  font-size: 1rem;
  line-height: 1.5;
  text-decoration: none;
  transition: color 0.3s, transform 0.2s;
}

.link-group a:hover {
  color: white;
  transform: translateX(3px);
}

.footer-copyright {
  text-align: center;
  padding-top: 80px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* 移动端响应式设计 */
@media (max-width: 768px) {
  .section-footer {
    padding: 20px 10px;
  }
  
  .footer-content {
    padding: 20px 10px;
  }
  
  .footer-logo {
    margin-bottom: 30px;
  }
  
  .footer-logo h1 {
    font-size: 1.8rem;
  }
  
  .footer-links {
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    gap: 0;
  }
  
  .link-group {
    width: 100%;
    max-width: 300px;
    text-align: center;
    margin-bottom: 25px;
    padding: 0;
  }
  
  .link-group h4 {
    font-size: 1.15rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }
  
  .link-group a {
    font-size: 1rem;
    margin-bottom: 12px;
    line-height: 1.6;
  }
  
  .footer-copyright {
    padding-top: 20px;
    margin-top: 15px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .section-footer {
    padding: 40px 15px;
  }
  
  .footer-content {
    padding: 20px 10px;
  }
  
  .footer-logo h1 {
    font-size: 1.6rem;
  }
  
  .link-group h4 {
    font-size: 1.1rem;
    margin-bottom: 18px;
  }
  
  .link-group a {
    font-size: 0.95rem;
    margin-bottom: 10px;
  }
  
  .footer-copyright {
    font-size: 0.85rem;
    padding-top: 15px;
  }
}
</style>