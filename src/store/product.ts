import { defineStore } from 'pinia';
import type { Product } from '../api/interfaces';
import { getProductDetail } from '../api/product';

export const useProductStore = defineStore('product', {
  state: () => ({
    product: null as Product | null,
    selectedSpec: null as number | null,
    quantity: 1,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    currentSpecStock(): number {
      if (!this.product || !this.product.specs || this.selectedSpec === null) {
        return 0;
      }

      const spec = this.product.specs.find(spec => spec.id === this.selectedSpec);
      return spec?.stock || 0;
    },

    currentSpecPrice(): number {
      if (!this.product || !this.product.specs || this.selectedSpec === null) {
        return this.product?.price || 0;
      }

      const spec = this.product.specs.find(spec => spec.id === this.selectedSpec);
      return spec?.price || this.product?.price || 0;
    },
  },

  actions: {
    async loadProductDetail(productId: number) {
      try {
        this.loading = true;
        this.error = null;
        
        // 使用实际API替代模拟数据
        const response = await getProductDetail(productId);
        
        if (response && response.code === 200 && response.data) {
          this.product = response.data;
          // 初始化选择第一个规格组合
          if (this.product.specs && this.product.specs.length > 0) {
            this.selectedSpec = this.product.specs[0].id;
          }
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '加载商品详情失败';
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('加载商品详情失败:', err);
      } finally {
        this.loading = false;
      }
    },

    setSelectedSpec(specId: number) {
      this.selectedSpec = specId;
    },

    setQuantity(quantity: number) {
      if (quantity > 0 && quantity <= this.currentSpecStock) {
        this.quantity = quantity;
      }
    },

    incrementQuantity() {
      if (this.quantity < this.currentSpecStock) {
        this.quantity++;
      }
    },

    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },

    reset() {
      this.product = null;
      this.selectedSpec = null;
      this.quantity = 1;
      this.error = null;
    },
  },
});