import { defineStore } from 'pinia';
import { getProductsByCategory } from '../api/product';
import type { Product, Category } from '../api/interfaces';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    // 分类导航相关状态
    isCategoryNavOpen: false,
    CategoryNavVisible: false,
    
    // 分类数据 - 这里保留静态数据作为基础分类
    categories: [
      { id: 1, name: '上衣', label: '上衣', icon: '👕', color: '#FF6B6B' },
      { id: 2, name: '下装', label: '下装', icon: '👖', color: '#4ECDC4' },
      { id: 3, name: '鞋子', label: '鞋子', icon: '👟', color: '#45B7D1' },
      { id: 4, name: '配饰', label: '配饰', icon: '👜', color: '#FED766' },
      { id: 5, name: '内衣', label: '内衣', icon: '👙', color: '#FF8C94' },
      { id: 6, name: '箱包', label: '箱包', icon: '🧳', color: '#7C7C7C' }
    ] as Category[],
    
    // 商品数据
    products: [] as Product[],
    
    // 当前选中的分类
    currentCategory: null as Category | null,
    
    // 排序选项
    sortBy: 'default', // default, price_asc, price_desc, sales, newest
    
    // 分页信息
    currentPage: 1,
    pageSize: 12,
    totalItems: 0,
    
    // 加载状态
    loading: false,
    error: null as string | null
  }),

  getters: {
    // 排序选项映射
    sortOptions(): Record<string, string> {
      return {
        'default': '综合排序',
        'priceAsc': '价格从低到高',
        'priceDesc': '价格从高到低',
        'salesDesc': '销量优先',
        'newest': '最新上架'
      };
    },
    
    // 当前排序（别名）
    currentSort(): string {
      return this.sortBy;
    },
    
    // 显示的商品列表（别名）
    displayProducts(): Product[] {
      return this.paginatedProducts;
    },
    
    // 总商品数（别名）
    totalProducts(): number {
      return this.currentCategoryProductCount;
    },
    
    // 获取分类下的产品（筛选、排序和分页）
    filteredAndSortedProducts(): Product[] {
      let result = [...this.products];
      
      // 根据当前分类筛选
      if (this.currentCategory && this.currentCategory.id) {
        const categoryId = this.currentCategory.id;
        // 使用类型断言安全地访问product对象的属性
        result = result.filter(product => {
          const p = product as any;
          return p.categoryId === categoryId || 
                 p.category_id === categoryId || 
                 (p.category && p.category.id === categoryId);
        });
      }
      
      // 根据排序选项排序
      switch (this.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'sales':
          result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
          break;
        case 'newest':
          result.sort((a, b) => {
            const productA = a as any;
            const productB = b as any;
            return new Date(productB.createdAt || 0).getTime() - new Date(productA.createdAt || 0).getTime();
          });
          break;
        default:
          // 默认排序，可以根据需要调整
          break;
      }
      
      return result;
    },
    
    // 获取当前页的产品
    paginatedProducts(): Product[] {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredAndSortedProducts.slice(startIndex, endIndex);
    },
    
    // 获取总页数
    totalPages(): number {
      return Math.ceil(this.filteredAndSortedProducts.length / this.pageSize);
    },
    
    // 获取当前分类下的产品数量
    currentCategoryProductCount(): number {
      if (!this.currentCategory || !this.currentCategory.id) return this.products.length;
      const categoryId = this.currentCategory.id;
      return this.products.filter(product => {
        const p = product as any;
        return p.categoryId === categoryId || 
               p.category_id === categoryId || 
               (p.category && p.category.id === categoryId);
      }).length;
    }
  },

  actions: {
    // 初始化数据
    async initializeData() {
      await this.loadProducts();
    },
    
    // 加载商品列表
    async loadProducts(page: number = 1, categoryId?: number, sortBy?: string) {
      try {
        this.loading = true;
        this.error = null;
        
        // 直接使用getProductsByCategory，当categoryId为undefined时可以获取所有商品
      const response = await getProductsByCategory((categoryId || 0).toString(), {
        page,
        pageSize: this.pageSize
      });
        
        if (response && response.code === 200 && response.data) {
          // 假设后端返回的数据结构包含list和total
          this.products = Array.isArray(response.data) ? response.data : response.data.list || [];
          this.totalItems = response.data.total || this.products.length;
          this.currentPage = page;
          
          // 如果指定了排序方式，更新状态
          if (sortBy) {
            this.sortBy = sortBy;
          }
          
          return this.products;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '加载商品列表失败';
          return [];
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('加载商品列表失败:', err);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 选择分类
    async handleNodeClick(category: Category) {
      try {
        this.loading = true;
        this.currentCategory = category;
        this.currentPage = 1; // 重置到第一页
        
        // 加载选中分类的商品
      await this.loadProducts(1, category?.id);
      } catch (err) {
        this.error = '加载分类商品失败';
        console.error('选择分类失败:', err);
      } finally {
        this.loading = false;
      }
    },

    // 处理页码大小变化
    async handleSizeChange(size: number) {
      this.pageSize = size;
      this.currentPage = 1; // 重置到第一页
      await this.loadProducts(1, this.currentCategory?.id || undefined);
    },

    // 处理页码变化
    async handleCurrentChange(page: number) {
      this.currentPage = page;
      await this.loadProducts(page, this.currentCategory?.id || undefined);
    },

    // 处理排序变化
    async handleSortChange(sortType: string) {
      this.sortBy = sortType;
      await this.loadProducts(1, this.currentCategory?.id || undefined, sortType);
    },

    // 切换分类导航的显示/隐藏
    toggleCategoryNav() {
      this.isCategoryNavOpen = !this.isCategoryNavOpen;
    },
    
    // 更新CategoryNavVisible状态（用于双向绑定）
    updateCategoryNavVisible(value: boolean) {
      this.CategoryNavVisible = value;
    },
    
    // 关闭分类导航
    closeCategoryNav() {
      this.isCategoryNavOpen = false;
    },
    
    // 打开分类导航
    openCategoryNav() {
      this.isCategoryNavOpen = true;
    },
    
    // 重置筛选条件
    resetFilters() {
      this.currentCategory = null;
      this.sortBy = 'default';
      this.currentPage = 1;
    }
  }
});