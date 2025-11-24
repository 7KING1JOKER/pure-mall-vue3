import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger)

const HorizontalScroll = {
  isMobile: false,
  scrollContainer: null,
  cardSections: [],

  init() {
    this.isMobile = window.innerWidth <= 768
    console.log("初始化水平滚动，移动端:", this.isMobile)

    if (this.isMobile) {
      this.scrollContainer = document.querySelector('.scroll-container')
      this.cardSections = document.querySelectorAll('.section-cards.horizontal-mode')
      
      this.setupHorizontalScroll()
      window.addEventListener('resize', this.onResize.bind(this))
    }
  },

  setupHorizontalScroll() {
    // 确保ScrollTrigger先重置
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      ScrollTrigger.clearScrollMemory()
      ScrollTrigger.refresh()
    }
    
    this.cardSections.forEach((section) => {
      const cardList = section.querySelector('.card-list')
      const cards = cardList.querySelectorAll('.image-card')
      
      // 设置卡片列表宽度（每个卡片占据100vw）
      cardList.style.width = `${cards.length * 100}vw`
      
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // 创建时间线动画
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${cardList.scrollWidth - this.scrollContainer.offsetWidth}`,
            scroller: this.scrollContainer,
            pin: true,
            scrub: true,
            markers: false,
            anticipatePin: 1
          }
        })

        tl.to(cardList, {
          x: () => -(cardList.scrollWidth - this.scrollContainer.offsetWidth),
          ease: "none"
        })
      }
    })
    
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh()
    }
  },

  onResize() {
    const nowMobile = window.innerWidth <= 768
    if (this.isMobile !== nowMobile) {
      this.destroy()
      this.init()
    } else if (this.isMobile) {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh()
      }
    }
  },

  destroy() {
    // 移除所有ScrollTrigger实例
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
    
    // 移除事件监听
    window.removeEventListener('resize', this.onResize)
    
    // 移除添加的样式
    this.cardSections.forEach(section => {
      const cardList = section.querySelector('.card-list')
      if (cardList) {
        cardList.style.width = ''
      }
    })
  }
}

export default HorizontalScroll
